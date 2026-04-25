import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Display } from '../pom';

const ELEMENT_ID = 'test-embed-display';
const EMBED_URL = 'https://example.com/embed';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await elementClient.resetState(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('Empty state', () => {
  test('Renders placeholder when content is empty', async ({ page }) => {
    const display = new Display(page);
    await expect(display.placeholder).toBeVisible();
    await expect(display.root).not.toBeVisible();
  });
});

test.describe('Content rendering', () => {
  test.beforeEach(async ({ page }) => {
    await elementClient.update(ELEMENT_ID, { url: EMBED_URL, height: 300 });
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('Renders iframe with src and height', async ({ page }) => {
    const display = new Display(page);
    await expect(display.viewer).toBeVisible();
    await expect(display.viewer).toHaveAttribute('src', EMBED_URL);
    await expect(display.viewer).toHaveAttribute('height', '300');
  });
});

test.afterAll(async () => {
  await elementClient.reset(ELEMENT_ID);
});
