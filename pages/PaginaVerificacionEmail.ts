import { Page, Locator, expect } from "@playwright/test" // Importamos Page y Locator de Playwright


export default class PaginaVerificacionEmail {
    readonly page: Page;
    readonly codigoVerificacionInput: Locator;
    readonly verificarButton: Locator;
    readonly verificacionExitosaAlert: Locator;

    constructor(page: Page) {
        this.page = page;
        this.codigoVerificacionInput = page.getByTestId('input-verification-code');
        this.verificarButton = page.getByTestId('btn-verify-email');
        this.verificacionExitosaAlert = page.getByText('¡Correo verificado exitosamente!')

    }

}