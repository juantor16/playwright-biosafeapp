import { google } from 'googleapis';
import fs from 'fs';
import readline from 'readline';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const CREDENTIALS_PATH = path.join(__dirname, './data/credentials.json');
const TOKEN_PATH = path.join(__dirname, './data/token.json');

async function getAccessToken(oAuth2Client: any) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('Autoriza esta aplicación visitando esta URL:', authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise<void>((resolve, reject) => {
        rl.question('Introduce el código de autorización aquí: ', (code: string) => {
            rl.close();
            oAuth2Client.getToken(code, (err: Error | null, token: any) => {
                if (err || !token) {
                    console.error('Error obteniendo el token:', err);
                    reject(err);
                    return;
                }
                oAuth2Client.setCredentials(token);
                fs.writeFileSync(TOKEN_PATH, JSON.stringify(token, null, 2));
                console.log('Token almacenado en token.json');
                resolve();
            });
        });
    });
}

async function generateToken() {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        console.error("No se encontró credentials.json en ./data. Descarga las credenciales de Google Cloud.");
        return;
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8')).web;
    const { client_id, client_secret } = credentials;
    const redirect_uris = ['http://localhost'];

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    if (fs.existsSync(TOKEN_PATH)) {
        console.log('El token ya existe, no es necesario generarlo de nuevo.');
        return;
    }

    await getAccessToken(oAuth2Client);
}

generateToken().catch(console.error);