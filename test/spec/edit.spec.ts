import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Edit } from '../pom';

const ELEMENT_ID = 'test-embed-edit';
const EMBED_URL = 'https://example.com/embed';
const OTHER_URL = 'https://example.com/other';

test.beforeEach(async ({ page }) => {
  // Serve embedded pages locally so tests don't depend on external hosts
  await page.route('https://example.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<p>Embedded</p>' }),
  );
  await elementClient.reset(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('When URL is not set', () => {
  test('Shows the empty state panel', async ({ page }) => {
    const edit = new Edit(page);
    await expect(edit.emptyState).toBeVisible();
    await expect(edit.enterUrlBtn).toBeVisible();
    await expect(edit.placeholder).not.toBeVisible();
    await expect(edit.viewer).not.toBeVisible();
  });

  test('Enter URL opens the dialog', async ({ page }) => {
    const edit = new Edit(page);
    await edit.openAddDialog();
    const dialog = edit.addDialog;
    await expect(dialog.urlInput).toHaveValue('');
    await expect(dialog.urlInput).toBeFocused();
    await expect(dialog.submitBtn).toBeVisible();
    await expect(dialog.saveBtn).not.toBeVisible();
  });

  test('Requires a URL', async ({ page }) => {
    const edit = new Edit(page);
    await edit.openAddDialog();
    await edit.addDialog.submitBtn.click();
    await expect(edit.addDialog.body.getByText('Enter a URL.')).toBeVisible();
    await expect(edit.addDialog.el).toBeVisible();
    await expect(edit.viewer).not.toBeVisible();
  });

  test('Rejects URL without protocol', async ({ page }) => {
    const edit = new Edit(page);
    await edit.openAddDialog();
    await edit.addDialog.urlInput.fill('example.com/embed');
    await edit.addDialog.submitBtn.click();
    await expect(
      edit.addDialog.body.getByText('URL is not valid.'),
    ).toBeVisible();
    await expect(edit.addDialog.el).toBeVisible();
    await expect(edit.viewer).not.toBeVisible();
  });

  test('Rejects non-http protocols', async ({ page }) => {
    const edit = new Edit(page);
    await edit.openAddDialog();
    await edit.addDialog.urlInput.fill('ftp://example.com/embed');
    await edit.addDialog.submitBtn.click();
    await expect(
      edit.addDialog.body.getByText('URL is not valid.'),
    ).toBeVisible();
  });

  test('Submitting a valid URL renders the iframe', async ({ page }) => {
    const edit = new Edit(page);
    await edit.openAddDialog();
    await edit.addDialog.urlInput.fill(EMBED_URL);
    await edit.addDialog.submitBtn.click();
    await edit.addDialog.waitForClose();
    await expect(edit.viewer).toBeVisible();
    await expect(edit.viewer).toHaveAttribute('src', EMBED_URL);
    await expect(edit.viewer).toHaveAttribute('height', '260');
    await expect(edit.emptyState).not.toBeVisible();
    await page.reload();
    await expect(edit.viewer).toHaveAttribute('src', EMBED_URL);
  });

  test('Cancel leaves the element empty', async ({ page }) => {
    const edit = new Edit(page);
    await edit.openAddDialog();
    await edit.addDialog.urlInput.fill(EMBED_URL);
    await edit.addDialog.cancel();
    await expect(edit.emptyState).toBeVisible();
    await expect(edit.viewer).not.toBeVisible();
    await edit.openAddDialog();
    await expect(edit.addDialog.urlInput).toHaveValue('');
  });
});

test.describe('When URL is set', () => {
  test.beforeEach(async ({ page }) => {
    await elementClient.update(ELEMENT_ID, { url: EMBED_URL, height: 300 });
    await page.reload();
  });

  test('Shows viewer with src and height', async ({ page }) => {
    const edit = new Edit(page);
    await expect(edit.viewer).toBeVisible();
    await expect(edit.viewer).toHaveAttribute('src', EMBED_URL);
    await expect(edit.viewer).toHaveAttribute('height', '300');
    await expect(edit.emptyState).not.toBeVisible();
  });

  test('Shows actions only while focused', async ({ page }) => {
    const edit = new Edit(page);
    await expect(edit.viewer).toBeVisible();
    await expect(edit.changeUrlBtn).not.toBeVisible();
    await expect(edit.removeBtn).not.toBeVisible();
    await edit.focus();
    await expect(edit.actionsRow).toContainText(EMBED_URL);
    await expect(edit.changeUrlBtn).toBeVisible();
    await expect(edit.removeBtn).toBeVisible();
  });

  test('Change URL pre-fills the dialog and saves', async ({ page }) => {
    const edit = new Edit(page);
    await edit.openChangeDialog();
    const dialog = edit.changeDialog;
    await expect(dialog.urlInput).toHaveValue(EMBED_URL);
    await expect(dialog.saveBtn).toBeVisible();
    await expect(dialog.submitBtn).not.toBeVisible();
    await dialog.urlInput.fill(OTHER_URL);
    await dialog.saveBtn.click();
    await dialog.waitForClose();
    await expect(edit.viewer).toHaveAttribute('src', OTHER_URL);
    await expect(edit.actionsRow).toContainText(OTHER_URL);
    await page.reload();
    await expect(edit.viewer).toHaveAttribute('src', OTHER_URL);
  });

  test('Cancel discards pending changes', async ({ page }) => {
    const edit = new Edit(page);
    await edit.openChangeDialog();
    await edit.changeDialog.urlInput.fill(OTHER_URL);
    await edit.changeDialog.cancel();
    await expect(edit.viewer).toHaveAttribute('src', EMBED_URL);
    await edit.changeUrlBtn.click();
    await edit.changeDialog.waitForOpen();
    await expect(edit.changeDialog.urlInput).toHaveValue(EMBED_URL);
  });

  test('Remove returns to the empty state', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await edit.removeBtn.click();
    await expect(edit.emptyState).toBeVisible();
    await expect(edit.viewer).not.toBeVisible();
    await page.reload();
    await expect(edit.emptyState).toBeVisible();
    await edit.openAddDialog();
    await expect(edit.addDialog.urlInput).toHaveValue('');
  });
});

test.describe('Height', () => {
  test.beforeEach(async ({ page }) => {
    await elementClient.update(ELEMENT_ID, { url: EMBED_URL, height: 300 });
    await page.reload();
  });

  test('Side toolbar exposes the height input', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await expect(edit.heightInput).toHaveValue('300');
    await expect(edit.topToolbar.getByLabel('Height')).toHaveCount(0);
  });

  test('Persists height set via side toolbar', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await edit.heightInput.fill('450');
    await expect(edit.viewer).toHaveAttribute('height', '450');
    await page.reload();
    await edit.focus();
    await expect(edit.heightInput).toHaveValue('450');
    await expect(edit.viewer).toHaveAttribute('height', '450');
  });

  test('Rejects out-of-range height', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await edit.heightInput.fill('50');
    await expect(
      edit.sideToolbar.getByText('Height must be at least 100px'),
    ).toBeVisible();
    await edit.heightInput.fill('5000');
    await expect(
      edit.sideToolbar.getByText('Height must be at most 3000px'),
    ).toBeVisible();
    await expect(edit.viewer).toHaveAttribute('height', '300');
  });
});

test.describe('Readonly mode', () => {
  test('Shows placeholder instead of the empty state', async ({ page }) => {
    const edit = new Edit(page);
    await edit.setReadonly();
    await expect(edit.placeholder).toBeVisible();
    await expect(edit.emptyState).not.toBeVisible();
    await expect(edit.enterUrlBtn).not.toBeVisible();
  });

  test('Keeps viewer visible and hides actions when set', async ({ page }) => {
    await elementClient.update(ELEMENT_ID, { url: EMBED_URL, height: 300 });
    await page.reload();
    const edit = new Edit(page);
    await edit.setReadonly();
    await expect(edit.viewer).toBeVisible();
    await edit.focus();
    await expect(edit.changeUrlBtn).not.toBeVisible();
    await expect(edit.removeBtn).not.toBeVisible();
  });
});
