import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class UrlDialog extends pom.TailorDialog {
  readonly urlInput: Locator;
  readonly submitBtn: Locator;
  readonly saveBtn: Locator;

  constructor(edit: pom.EditPanel, title: string) {
    super(edit.el, title);
    this.urlInput = this.body.getByLabel('URL');
    this.submitBtn = this.action('Submit');
    this.saveBtn = this.action('Save');
  }
}

export class Edit extends pom.EditPanel {
  readonly root: Locator;
  readonly placeholder: Locator;
  readonly emptyState: Locator;
  readonly enterUrlBtn: Locator;
  readonly viewer: Locator;
  readonly heightInput: Locator;
  readonly actionsRow: Locator;
  readonly changeUrlBtn: Locator;
  readonly removeBtn: Locator;
  readonly addDialog: UrlDialog;
  readonly changeDialog: UrlDialog;

  constructor(page: Page) {
    super(page);
    this.root = this.editor.locator('.tce-embed');
    this.placeholder = this.editor.getByText('Embed component');
    this.emptyState = this.root.getByText('Add an embed');
    this.enterUrlBtn = this.root.getByRole('button', { name: 'Enter URL' });
    this.viewer = this.editor.locator('iframe[title="Embedded page"]');
    this.heightInput = this.sideToolbar.getByLabel('Height');
    this.actionsRow = this.root.locator('.position-sticky');
    this.changeUrlBtn = this.actionsRow.getByRole('button', {
      name: 'Change URL',
    });
    this.removeBtn = this.actionsRow.getByRole('button', { name: 'Remove' });
    this.addDialog = new UrlDialog(this, 'Add an embed');
    this.changeDialog = new UrlDialog(this, 'Change URL');
  }

  async openAddDialog() {
    await this.enterUrlBtn.click();
    await this.addDialog.waitForOpen();
  }

  async openChangeDialog() {
    await this.focus();
    await this.changeUrlBtn.click();
    await this.changeDialog.waitForOpen();
  }
}
