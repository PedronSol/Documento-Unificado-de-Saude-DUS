const { test, expect } = require('@playwright/test');

const MOCK_USER = {
  cpf_paciente: '000.111.222-22',
  nome_paciente: 'Carlos Silva',
  status_saude: 'updated',
  tipo_sanguineo: 'A+',
  valor_qr: 'https://saude.gov.br/passport/000.111.222-22',
  avatar: null,
};

const MOCK_VACCINES = [
  {
    id_vacina: '1',
    paciente_id: '000.111.222-22',
    nome_vacina: 'COVID-19 (Pfizer)',
    dose: '3ª Dose - Reforço',
    data_aplicacao: '10/02/2024',
    status_vacina: 'applied',
  },
  {
    id_vacina: '2',
    paciente_id: '000.111.222-22',
    nome_vacina: 'Influenza',
    dose: 'Dose Anual',
    data_aplicacao: null,
    status_vacina: 'pending',
  },
];

const MOCK_ALERTS = [
  {
    id_alerta: '1',
    paciente_id: '000.111.222-22',
    tipo_alerta: 'condition',
    titulo_alerta: 'Hipertensão',
    descricao_alerta: 'Diagnosticada em 2021. Controlada.',
    severidade_alerta: 'medium',
  },
  {
    id_alerta: '2',
    paciente_id: '000.111.222-22',
    tipo_alerta: 'allergy',
    titulo_alerta: 'Alergia a Dipirona',
    descricao_alerta: 'Urticária severa.',
    severidade_alerta: 'high',
  },
];

const MOCK_DOCUMENTS = [
  {
    id_documento: '1',
    paciente_id: '000.111.222-22',
    titulo_documento: 'Eletrocardiograma',
    tipo_documento: 'exam',
    data_criacao_documento: '12/03/2024',
    status_documento: 'viewed',
  },
  {
    id_documento: '2',
    paciente_id: '000.111.222-22',
    titulo_documento: 'Receita - Dr. Marcos Lima',
    tipo_documento: 'prescription',
    data_criacao_documento: '12/03/2024',
    status_documento: 'new',
  },
];

async function populateSession(page) {
  await page.goto('/');
  await page.evaluate(({ user, vaccines, alerts, documents }) => {
    sessionStorage.setItem('patient_data', JSON.stringify(user));
    sessionStorage.setItem('vaccines', JSON.stringify(vaccines));
    sessionStorage.setItem('alerts', JSON.stringify(alerts));
    sessionStorage.setItem('documents', JSON.stringify(documents));
  }, {
    user: MOCK_USER,
    vaccines: MOCK_VACCINES,
    alerts: MOCK_ALERTS,
    documents: MOCK_DOCUMENTS,
  });
  await page.goto('/home');
}

test.describe('Página Home - sem sessão', () => {
  test('redireciona para / quando não há dados de sessão', async ({ page }) => {
    await page.goto('/home');
    await expect(page).toHaveURL('/', { timeout: 5000 });
  });
});

test.describe('Página Home - com sessão válida', () => {
  test.beforeEach(async ({ page }) => {
    await populateSession(page);
  });

  test('exibe o nome do paciente no header', async ({ page }) => {
    await expect(page.getByText('Carlos Silva')).toBeVisible();
  });

  test('exibe vacinas carregadas da sessão', async ({ page }) => {
    await expect(page.getByText('COVID-19 (Pfizer)')).toBeVisible();
    await expect(page.getByText('3ª Dose - Reforço')).toBeVisible();
    await expect(page.getByText('Influenza')).toBeVisible();
  });

  test('exibe badge de status correto para cada vacina', async ({ page }) => {
    await expect(page.getByText('Aplicada', { exact: true })).toBeVisible();
    await expect(page.getByText('Pendente', { exact: true })).toBeVisible();
  });

  test('abre modal ao clicar em Adicionar Vacina', async ({ page }) => {
    await page.getByRole('button', { name: /Adicionar Vacina/i }).click();
    await expect(page.getByText('Registrar Nova Vacina')).toBeVisible();
    await expect(page.getByPlaceholder(/COVID-19/i)).toBeVisible();
  });

  test('fecha modal ao clicar em Cancelar', async ({ page }) => {
    await page.getByRole('button', { name: /Adicionar Vacina/i }).click();
    await expect(page.getByText('Registrar Nova Vacina')).toBeVisible();
    await page.getByRole('button', { name: /Cancelar/i }).click();
    await expect(page.getByText('Registrar Nova Vacina')).not.toBeVisible();
  });

  test('modal de edição preenche campos com dados da vacina', async ({ page }) => {
    await page.getByTitle('Editar vacina').first().click();
    await expect(page.getByText('Editar Registro de Vacina')).toBeVisible();
    await expect(page.locator('input[placeholder*="COVID-19"]')).toHaveValue('COVID-19 (Pfizer)');
  });

  test('exibe alertas médicos', async ({ page }) => {
    await expect(page.getByText('Alertas Médicos')).toBeVisible();
    await expect(page.getByText('Hipertensão')).toBeVisible();
    await expect(page.getByText('Alergia a Dipirona')).toBeVisible();
  });

  test('exibe documentos digitais', async ({ page }) => {
    await expect(page.getByText('Documentos Digitais')).toBeVisible();
    await expect(page.getByText('Eletrocardiograma')).toBeVisible();
    await expect(page.getByText('Receita - Dr. Marcos Lima')).toBeVisible();
  });

  test('logout redireciona para /', async ({ page }) => {
    // abre dropdown do avatar
    await page.locator('header button').first().click();
    await page.getByText('Sair da Conta').click();
    await expect(page).toHaveURL('/', { timeout: 5000 });
  });
});
