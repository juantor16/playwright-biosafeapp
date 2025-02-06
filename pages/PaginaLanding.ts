import { Page, Locator, expect } from "@playwright/test" // Importamos Page y Locator de Playwright
import dotenv from 'dotenv';

dotenv.config();
export default class PaginaLanding {
    readonly page: Page;
    readonly botonDeRegistrarse: Locator;

    constructor(page: Page) {
        this.page = page;
        this.botonDeRegistrarse = page.getByRole('link', { name: 'Registrarse' }).first()
    }

    async irARegristroDeCuenta() {
        this.botonDeRegistrarse.click({ force: true });
        expect(this.page).toHaveURL(process.env.BASE_URL! + '/signup')
    }
}