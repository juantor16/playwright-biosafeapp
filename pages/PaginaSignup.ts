import { Page, Locator, expect } from "@playwright/test" // Importamos Page y Locator de Playwright
import { getVerificationCode } from '../utils/gmailUtils';
import PaginaVerificacionEmail from '../pages/PaginaVerificacionEmail';
import PaginaLogin from "./PaginaLogin";

export default class PaginaSignup {
    readonly paginaVerificacionEmail: PaginaVerificacionEmail;
    readonly paginaLogin: PaginaLogin;
    readonly page: Page;
    readonly nombreInput: Locator;
    readonly emailInput: Locator;
    readonly contrasenaInput: Locator;
    readonly confirmarContrasenaInput: Locator;
    readonly registroButton: Locator;
    readonly registroExitosoAlert: Locator;

    constructor(page: Page) {
        this.page = page;
        this.paginaVerificacionEmail = new PaginaVerificacionEmail(page);
        this.paginaLogin = new PaginaLogin(page);
        this.nombreInput = page.getByTestId('nameInput');
        this.emailInput = page.getByTestId('emailInput');
        this.contrasenaInput = page.getByTestId('passwordInput');
        this.confirmarContrasenaInput = page.getByTestId('confirmPasswordInput');
        this.registroButton = page.getByTestId('botonRegistro');
        this.registroExitosoAlert = page.getByText('¡Registro exitoso!')
    }


    async userSignupAndLogin(user: any) {
        const mailDeUsuarioUnico = user.email.replace('@', "+" + Date.now() + "@")
        console.log(mailDeUsuarioUnico)
        await this.nombreInput.fill(user.nombre)
        await this.emailInput.fill(mailDeUsuarioUnico)
        await this.contrasenaInput.fill(user.contrasena)
        await this.confirmarContrasenaInput.fill(user.contrasena)
        await this.registroButton.click()
        await expect(this.registroExitosoAlert).toBeVisible()
        await expect(this.registroExitosoAlert).not.toBeVisible()

        await expect(this.page).toHaveURL(process.env.BASE_URL! + '/verify-email')
        await this.page.waitForTimeout(1000)
        const verificationCode = await getVerificationCode()

        console.log("Código de verificación: ", verificationCode)
        await this.paginaVerificacionEmail.codigoVerificacionInput.fill(verificationCode)
        await this.paginaVerificacionEmail.verificarButton.click()
        await expect(this.paginaVerificacionEmail.verificacionExitosaAlert).toBeVisible({ timeout: 10000 })
        await expect(this.page).toHaveURL(process.env.BASE_URL! + '/login')
        await this.paginaLogin.emailInput.fill(mailDeUsuarioUnico)
        await this.paginaLogin.passwordInput.fill(user.contrasena)
        await this.paginaLogin.loginButton.click();
        await expect(this.page).toHaveURL(process.env.BASE_URL! + '/dashboard')
    }

}