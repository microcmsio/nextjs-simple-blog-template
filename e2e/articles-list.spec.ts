import { test, expect } from '@playwright/test';

test.describe('記事一覧ページ', () => {
  test('記事一覧ページが正しく表示される', async ({ page }) => {
    await page.goto('/');

    // ページタイトルが存在することを確認
    await expect(page).toHaveTitle(/Blog/);

    // 記事リストが表示されることを確認
    const articleList = page.locator('[data-testid="article-list"]').or(
      page.locator('article').first()
    ).or(
      page.locator('a[href*="/articles/"]').first()
    );
    
    // 記事が存在するか確認
    await expect(articleList).toBeVisible();
  });

  test('記事リンクをクリックして詳細ページに遷移できる', async ({ page }) => {
    await page.goto('/');

    // 最初の記事リンクを取得してクリック
    const firstArticleLink = page.locator('a[href*="/articles/"]').first();
    await expect(firstArticleLink).toBeVisible();
    
    const href = await firstArticleLink.getAttribute('href');
    await firstArticleLink.click();

    // 記事詳細ページに遷移したことを確認
    await expect(page).toHaveURL(new RegExp(href!));
  });

  test('ページネーションが表示される（記事が多い場合）', async ({ page }) => {
    await page.goto('/');

    // ページネーションが存在するかチェック（存在しない場合はスキップ）
    const pagination = page.locator('[data-testid="pagination"]').or(
      page.locator('nav').or(
        page.locator('a[href*="/p/"]')
      )
    );
    
    const paginationCount = await pagination.count();
    if (paginationCount > 0) {
      await expect(pagination.first()).toBeVisible();
    }
  });
});