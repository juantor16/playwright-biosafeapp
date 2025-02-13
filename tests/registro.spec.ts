import { test } from '@playwright/test';
import PaginaLanding from '../pages/PaginaLanding';
import PaginaSignup from '../pages/PaginaSignup';
import data from '../data/usuarios.json'
import PaginaVerificacionEmail from '../pages/PaginaVerificacionEmail';
import PaginaLogin from '../pages/PaginaLogin';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

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
  await page.goto(process.env.BASE_URL!);
  await paginaLanding.irARegristroDeCuenta()
});

test('C-1 · Registro Happy Path', async () => {
  await paginaSignup.userSignupAndLogin(data.usuarios.correcto)
});

