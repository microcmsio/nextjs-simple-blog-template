import { test, expect } from '@playwright/test';

test.describe('ホームページのテスト', () => {
  test('localhost:3000にアクセスできることを確認', async ({ page }) => {
    // localhost:3000にアクセス
    await page.goto('/');

    // ページが正常に読み込まれたことを確認
    await expect(page).toHaveURL('http://localhost:3000/');

    // ページタイトルが存在することを確認
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  // test('ヘッダーが表示されることを確認', async ({ page }) => {
  //   await page.goto('/');

  //   // ヘッダー要素が存在することを確認
  //   const header = page.locator('header');
  //   await expect(header).toBeVisible();
  // });

  // test('記事リストが表示されることを確認', async ({ page }) => {
  //   await page.goto('/');

  //   // 記事リストのコンテナが存在することを確認
  //   const articleList = page.locator('main');
  //   await expect(articleList).toBeVisible();
  // });

  // test('ナビゲーションリンクが機能することを確認', async ({ page }) => {
  //   await page.goto('/');

  //   // ロゴをクリックしてホームに戻ることを確認
  //   const logo = page.locator('header a').first();
  //   await logo.click();
  //   await expect(page).toHaveURL('http://localhost:3000/');
  // });

  // test('ページのレスポンシブデザインを確認', async ({ page }) => {
  //   // デスクトップサイズ
  //   await page.setViewportSize({ width: 1280, height: 720 });
  //   await page.goto('/');
  //   await expect(page.locator('header')).toBeVisible();

  //   // モバイルサイズ
  //   await page.setViewportSize({ width: 375, height: 667 });
  //   await expect(page.locator('header')).toBeVisible();
  // });
});