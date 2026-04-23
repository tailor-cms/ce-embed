import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Edit extends pom.EditPanel {
  readonly placeholder: Locator;
  readonly viewer: Locator;
  readonly heightInput: Locator;
  readonly urlInput: Locator;
  readonly editBtn: Locator;
  readonly saveBtn: Locator;
  readonly cancelBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.placeholder = this.editor.getByText('Embed component');
    this.viewer = this.editor.locator('iframe[title="PDF Viewer"]');
    this.heightInput = this.topToolbar.getByLabel('Height');
    this.urlInput = this.topToolbar.getByLabel('URL');
    this.editBtn = this.topToolbar.getByRole('button', { name: 'Edit' });
    this.saveBtn = this.topToolbar.getByRole('button', { name: 'Save' });
    this.cancelBtn = this.topToolbar.getByRole('button', { name: 'Cancel' });
  }

  async focus() {
    await this.editor.click({ position: { x: 0, y: 0 } });
  }
}
