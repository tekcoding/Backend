import {readFileSync} from "fs"
import path from "path";
import { fileURLToPath } from "url";


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const emailTemplatesDir = path.join(__dirname, 'emailTemplates');

export const forgotPassHTML = readFileSync(emailTemplatesDir+'/forgotPassword.html', 'utf-8');
export const welcomeHTML = readFileSync(emailTemplatesDir+'/welcome.html', 'utf-8');

