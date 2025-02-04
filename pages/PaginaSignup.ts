import { Page, Locator, expect } from "@playwright/test" // Importamos Page y Locator de Playwright

export default class PaginaSignup {
    readonly page: Page;
    readonly nombreInput: Locator;
    readonly emailInput: Locator;
    readonly contrasenaInput: Locator;
    readonly confirmarContrasenaInput: Locator;
    readonly registroButton: Locator;
    readonly registroExitosoAlert: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nombreInput = page.getByTestId('nameInput');
        this.emailInput = page.getByTestId('emailInput');
        this.contrasenaInput = page.getByTestId('passwordInput');
        this.confirmarContrasenaInput = page.getByTestId('confirmPasswordInput');
        this.registroButton = page.getByTestId('botonRegistro');
        this.registroExitosoAlert = page.getByText('¡Registro exitoso!')
    }


    async completarRegistroExitoso(user: any): Promise<string> {
        const mailDeUsuarioUnico = user.email.replace('@', "+" + Date.now() + "@")
        console.log(mailDeUsuarioUnico)
        await this.nombreInput.fill(user.nombre)
        await this.emailInput.fill(mailDeUsuarioUnico)
        await this.contrasenaInput.fill(user.contrasena)
        await this.confirmarContrasenaInput.fill(user.contrasena)
        await this.registroButton.click()
        await expect(this.registroExitosoAlert).toBeVisible()
        await expect(this.registroExitosoAlert).not.toBeVisible()
        return mailDeUsuarioUnico;
    }

}