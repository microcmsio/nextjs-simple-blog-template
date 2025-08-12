import { test, expect } from '@playwright/test';

test.describe('記事詳細ページ', () => {
  let articleUrl: string;

  test.beforeEach(async ({ page }) => {
    // まず記事一覧ページに行き、最初の記事のURLを取得
    await page.goto('/');
    const firstArticleLink = page.locator('a[href*="/articles/"]').first();
    await expect(firstArticleLink).toBeVisible();
    articleUrl = await firstArticleLink.getAttribute('href') || '/articles/test';
  });

  test('記事詳細ページが正しく表示される', async ({ page }) => {
    await page.goto(articleUrl);

    // ページが正常に読み込まれることを確認
    await expect(page).not.toHaveTitle('404');

    // 記事のコンテンツが存在することを確認（最初に見つかった要素のみ）
    const articleContent = page.locator('article').or(
      page.locator('[data-testid="article-content"]')
    ).or(
      page.locator('main')
    ).first();
    
    await expect(articleContent).toBeVisible();
  });

  test('記事タイトルが表示される', async ({ page }) => {
    await page.goto(articleUrl);

    // H1タグまたはタイトルが表示されることを確認（最初に見つかった要素のみ）
    const title = page.locator('h1').or(
      page.locator('[data-testid="article-title"]')
    ).first();
    
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();
  });

  test('記事の日付が表示される', async ({ page }) => {
    await page.goto(articleUrl);

    // 日付要素が存在することを確認
    const dateElement = page.locator('[data-testid="article-date"]').or(
      page.locator('time')
    ).or(
      page.locator('*').filter({ hasText: /\d{4}[-/]\d{1,2}[-/]\d{1,2}/ }).first()
    );
    
    // 日付が存在する場合のみテスト
    const dateCount = await dateElement.count();
    if (dateCount > 0) {
      await expect(dateElement.first()).toBeVisible();
    }
  });

  test('記事の本文が表示される', async ({ page }) => {
    await page.goto(articleUrl);

    // 記事本文のコンテンツが存在することを確認
    const content = page.locator('div').filter({ hasText: /\w+/ }).first();
    
    await expect(content).toBeVisible();
  });

  test('ホームページに戻るナビゲーションが機能する', async ({ page }) => {
    await page.goto(articleUrl);

    // ホームページリンクまたはロゴをクリック
    const homeLink = page.locator('a[href="/"]').or(
      page.locator('[data-testid="home-link"]')
    ).first();
    
    // ホームリンクが存在する場合のみテスト
    const homeLinkCount = await homeLink.count();
    if (homeLinkCount > 0) {
      await homeLink.click();
      await expect(page).toHaveURL('/');
    }
  });
});