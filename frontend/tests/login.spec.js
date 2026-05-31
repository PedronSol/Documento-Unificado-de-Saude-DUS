const { test, expect } = require('@playwright/test');

const MOCK_LOGIN_RESPONSE = {
  patient_data: {
    cpf_paciente: '000.111.222-22',
    nome_paciente: 'Carlos Silva',
    status_saude: 'updated',
    tipo_sanguineo: 'A+',
    valor_qr: 'https://saude.gov.br/passport/000.111.222-22',
    avatar: null,
  },
  vaccines: [],
  alerts: [],
  documents: [],
};

test.describe('Página de Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('exibe título, campos e botão de entrar', async ({ page }) => {
    await expect(page.getByText('Passaporte de Saúde')).toBeVisible();
    await expect(page.getByPlaceholder('seu@email.com')).toBeVisible();
    await expect(page.getByPlaceholder('Digite sua senha')).toBeVisible();
    await expect(page.getByRole('button', { name: /Entrar/i })).toBeVisible();
  });

  test('alterna visibilidade da senha', async ({ page }) => {
    const input = page.getByPlaceholder('Digite sua senha');
    // botão de toggle é irmão do input dentro do div.relative
    const toggle = page.locator('input[placeholder="Digite sua senha"] + button');

    await expect(input).toHaveAttribute('type', 'password');
    await toggle.click();
    await expect(input).toHaveAttribute('type', 'text');
    await toggle.click();
    await expect(input).toHaveAttribute('type', 'password');
  });

  test('exibe mensagem de erro em credenciais inválidas', async ({ page }) => {
    await page.route('**/login', (route) =>
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'E-mail ou senha incorretos.' }),
      })
    );

    await page.fill('input[placeholder="seu@email.com"]', 'errado@email.com');
    await page.fill('input[placeholder="Digite sua senha"]', 'senhaerrada');
    await page.getByRole('button', { name: /Entrar/i }).click();

    await expect(page.getByText('E-mail ou senha incorretos.')).toBeVisible();
  });

  test('redireciona para /home após login bem-sucedido', async ({ page }) => {
    await page.route('**/login', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_LOGIN_RESPONSE),
      })
    );

    await page.fill('input[placeholder="seu@email.com"]', 'carlos.silva@email.com');
    await page.fill('input[placeholder="Digite sua senha"]', 'senha123');
    await page.getByRole('button', { name: /Entrar/i }).click();

    await expect(page).toHaveURL('/home', { timeout: 10000 });
  });

  test('armazena dados do paciente na sessionStorage após login', async ({ page }) => {
    await page.route('**/login', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_LOGIN_RESPONSE),
      })
    );

    await page.fill('input[placeholder="seu@email.com"]', 'carlos.silva@email.com');
    await page.fill('input[placeholder="Digite sua senha"]', 'senha123');
    await page.getByRole('button', { name: /Entrar/i }).click();

    await page.waitForURL('/home', { timeout: 10000 });

    const stored = await page.evaluate(() =>
      JSON.parse(sessionStorage.getItem('patient_data'))
    );
    expect(stored.nome_paciente).toBe('Carlos Silva');
    expect(stored.cpf_paciente).toBe('000.111.222-22');
  });
});
