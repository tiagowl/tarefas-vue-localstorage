import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__TAREFAS_DISABLE_SEED__ = true;
  });
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('cria tarefa, subtarefa, deriva status e persiste após reload', async ({ page }) => {
  await page.getByRole('button', { name: /Criar primeira tarefa/i }).click();
  await page.getByLabel('Nome').fill('Site institucional');
  await page.getByRole('button', { name: 'Criar', exact: true }).click();

  await expect(page.getByText('Site institucional')).toBeVisible();

  await page.getByRole('button', { name: /Abrir detalhes de Site institucional/i }).click();
  await page.getByLabel('Nova subtarefa').fill('Wireframes');
  await page.getByRole('button', { name: 'Adicionar' }).click();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Fechar', exact: true }).click();

  await expect(page.locator('[aria-label="Status: Feito"]').first()).toBeVisible();

  await page.reload();
  await expect(page.getByText('Site institucional')).toBeVisible();
  await expect(page.locator('[aria-label="Status: Feito"]').first()).toBeVisible();
});

test('alterna para o Kanban preservando os dados', async ({ page }) => {
  await page.getByRole('button', { name: /Criar primeira tarefa/i }).click();
  await page.getByLabel('Nome').fill('Revisar proposta');
  await page.getByRole('button', { name: 'Criar', exact: true }).click();

  await page.getByRole('button', { name: 'Kanban' }).click();

  await expect(page.getByRole('heading', { name: 'A fazer' })).toBeVisible();
  await expect(page.getByText('Revisar proposta')).toBeVisible();
});
