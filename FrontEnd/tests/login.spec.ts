import { test, expect } from '@playwright/test';

const MOCK_PACIENTE_RESPONSE = {
  message: 'Login efetuado com sucesso!',
  patient_data: {
    cpf_paciente: '00011122222',
    nome_paciente: 'Carlos Silva',
    nome_completo: 'Carlos Eduardo Silva',
    email: 'carlos.silva@email.com',
    avatar: null,
    status_saude: 'updated',
    tipo_sanguineo: 'A+',
    valor_qr: 'QR_Carlos',
  },
  vaccines: [
    {
      id_vacina: 1,
      nome_vacina: 'COVID-19 (Pfizer)',
      dose: '3ª Dose - Reforço',
      data_aplicacao: '2024-02-10',
      status_vacina: 'applied',
    },
  ],
  alerts: [
    {
      id_alerta: 1,
      tipo_alerta: 'condition',
      titulo_alerta: 'Hipertensão',
      descricao_alerta: 'Controlada.',
      severidade_alerta: 'high',
    },
  ],
  documents: [],
};


async function waitForHydration(page) {
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => {
    const el = document.querySelector('button, input');
    return !!el && Object.getOwnPropertyNames(el).some(k => k.startsWith('__reactFiber'));
  });
}

test.describe('Página de Login', () => {
  test('exibe os elementos da página corretamente', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    await expect(page.getByText('Passaporte de Saúde')).toBeVisible();
    await expect(page.getByText('Acesse sua carteira digital de saúde')).toBeVisible();
    await expect(page.getByPlaceholder('seu@email.com')).toBeVisible();
    await expect(page.getByPlaceholder('Digite sua senha')).toBeVisible();
    await expect(page.getByRole('button', { name: /Entrar/i })).toBeVisible();
  });

  test('alterna visibilidade da senha', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    const senhaInput = page.getByPlaceholder('Digite sua senha');
    await expect(senhaInput).toHaveAttribute('type', 'password');

    // Botão irmão do input de senha (ícone de olho)
    await page.locator('input[placeholder="Digite sua senha"] ~ button').click();
    await expect(senhaInput).toHaveAttribute('type', 'text');
  });

  test('exibe mensagem de erro com credenciais inválidas', async ({ page }) => {
    await page.route('**/login', (route) =>
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'E-mail ou senha incorretos.' }),
      })
    );

    await page.goto('/');
    await waitForHydration(page);
    await page.getByPlaceholder('seu@email.com').fill('errado@email.com');
    await page.getByPlaceholder('Digite sua senha').fill('senhaerrada');
    await page.getByRole('button', { name: /Entrar/i }).click();

    await expect(page.getByText('E-mail ou senha incorretos.')).toBeVisible({ timeout: 10000 });
  });

  test('redireciona para /home após login com sucesso', async ({ page }) => {
    await page.route('**/login', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PACIENTE_RESPONSE),
      })
    );

    await page.goto('/');
    await waitForHydration(page);
    await page.getByPlaceholder('seu@email.com').fill('carlos.silva@email.com');
    await page.getByPlaceholder('Digite sua senha').fill('senha123');
    await page.getByRole('button', { name: /Entrar/i }).click();

    await expect(page).toHaveURL('/home', { timeout: 10000 });
  });
});

test.describe('Página Home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);
    await page.evaluate((data) => {
      sessionStorage.setItem('patient_data', JSON.stringify(data.patient_data));
      sessionStorage.setItem('vaccines', JSON.stringify(data.vaccines));
      sessionStorage.setItem('alerts', JSON.stringify(data.alerts));
      sessionStorage.setItem('documents', JSON.stringify(data.documents));
    }, MOCK_PACIENTE_RESPONSE);
    await page.goto('/home');
    await waitForHydration(page);
  });

  test('exibe o nome do paciente logado', async ({ page }) => {
    await expect(page.getByText('Carlos Silva')).toBeVisible({ timeout: 10000 });
  });

  test('exibe vacinas do paciente', async ({ page }) => {
    await expect(page.getByText('COVID-19 (Pfizer)')).toBeVisible({ timeout: 10000 });
  });

  test('redireciona para login se não há sessão', async ({ page }) => {
    await page.evaluate(() => sessionStorage.clear());
    await Promise.all([
      page.waitForURL((url) => !url.href.includes('/home'), { timeout: 15000 }),
      page.reload(),
    ]);
    await expect(page).not.toHaveURL(/\/home/);
  });
});
