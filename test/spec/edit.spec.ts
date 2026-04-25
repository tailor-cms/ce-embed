import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Edit } from '../pom';

const ELEMENT_ID = 'test-embed-edit';
const EMBED_URL = 'https://example.com/embed';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('When URL is not set', () => {
  test('Shows placeholder', async ({ page }) => {
    const edit = new Edit(page);
    await expect(edit.placeholder).toBeVisible();
    await expect(edit.viewer).not.toBeVisible();
  });

  test('Form inputs are enabled for editing', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await expect(edit.urlInput).toBeEnabled();
    await expect(edit.heightInput).toBeEnabled();
  });

  test('Saves valid URL and height', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await edit.heightInput.fill('400');
    await edit.urlInput.fill(EMBED_URL);
    await edit.saveBtn.click();
    await expect(edit.viewer).toBeVisible();
    await expect(edit.viewer).toHaveAttribute('src', EMBED_URL);
    await expect(edit.viewer).toHaveAttribute('height', '400');
  });

  test('Rejects URL without protocol', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await edit.heightInput.fill('300');
    await edit.urlInput.fill('example.com/embed');
    await edit.saveBtn.click();
    await expect(edit.topToolbar.getByText('URL is not valid.')).toBeVisible();
    await expect(edit.viewer).not.toBeVisible();
  });
});

test.describe('When URL is set', () => {
  test.beforeEach(async ({ page }) => {
    await elementClient.update(ELEMENT_ID, { url: EMBED_URL, height: 300 });
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('Shows viewer with src and height', async ({ page }) => {
    const edit = new Edit(page);
    await expect(edit.viewer).toBeVisible();
    await expect(edit.viewer).toHaveAttribute('src', EMBED_URL);
    await expect(edit.viewer).toHaveAttribute('height', '300');
  });

  test('Form inputs are disabled until Edit is clicked', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await expect(edit.urlInput).toBeDisabled();
    await expect(edit.heightInput).toBeDisabled();
    await edit.editBtn.click();
    await expect(edit.urlInput).toBeEnabled();
    await expect(edit.heightInput).toBeEnabled();
  });

  test('Cancel reverts pending changes', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await edit.editBtn.click();
    await edit.urlInput.fill('https://example.com/other');
    await edit.cancelBtn.click();
    await expect(edit.urlInput).toHaveValue(EMBED_URL);
    await expect(edit.viewer).toHaveAttribute('src', EMBED_URL);
  });
});

test.describe('Readonly mode', () => {
  test('Hides the form prompt when empty', async ({ page }) => {
    const edit = new Edit(page);
    await edit.setReadonly();
    await edit.focus();
    await expect(edit.placeholder).toBeVisible();
    await expect(
      edit.el.getByText('Use toolbar to enter the url'),
    ).not.toBeVisible();
  });

  test('Keeps viewer visible when set', async ({ page }) => {
    await elementClient.update(ELEMENT_ID, { url: EMBED_URL, height: 300 });
    await page.reload({ waitUntil: 'networkidle' });
    const edit = new Edit(page);
    await edit.setReadonly();
    await expect(edit.viewer).toBeVisible();
  });
});
