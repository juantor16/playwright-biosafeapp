import { test, expect } from '@playwright/test';
import PaginaLanding from '../pages/PaginaLanding';
import PaginaSignup from '../pages/PaginaSignup';
import data from '../data/usuarios.json'
import { getVerificationCode } from '../utils/gmailUtils';
import PaginaVerificacionEmail from '../pages/PaginaVerificacionEmail';
import PaginaLogin from '../pages/PaginaLogin';

let paginaLanding: PaginaLanding;
let paginaSignup: PaginaSignup;
let paginaVerificacionEmail: PaginaVerificacionEmail;
let paginaLogin: PaginaLogin;

test.beforeEach(async ({ page }) => {
  console.log("BeforeEach: Configuracion inicial")
  paginaLanding = new PaginaLanding(page)
  paginaSignup = new PaginaSignup(page)
  paginaVerificacionEmail = new PaginaVerificacionEmail(page)
  paginaLogin = new PaginaLogin(page)
});

test('C-1 · Registro Happy Path', async ({ page }) => {
  await page.goto('https://qa.biosafeapp.com');
  await paginaLanding.irARegristroDeCuenta()
  const emailDeusuarioUnico = await paginaSignup.completarRegistroExitoso(data.usuarios.correcto)
  await expect(page).toHaveURL('https://qa.biosafeapp.com/verify-email')

  const verificationCode = await getVerificationCode()

  console.log("Código de verificación: ", verificationCode)
  await paginaVerificacionEmail.codigoVerificacionInput.fill(verificationCode)
  await paginaVerificacionEmail.verificarButton.click()
  await expect(paginaVerificacionEmail.verificacionExitosaAlert).toBeVisible()
  await expect(page).toHaveURL('https://qa.biosafeapp.com/login')
  await paginaLogin.emailInput.fill(emailDeusuarioUnico)
  await paginaLogin.passwordInput.fill(data.usuarios.correcto.contrasena)
  await paginaLogin.loginButton.click();
  await expect(page).toHaveURL('https://qa.biosafeapp.com/dashboard')
});

