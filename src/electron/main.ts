import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import fs from "fs";
import { isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";

// Diretório atual
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Cria a janela e configurações principais
app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        // autoHideMenuBar : true,
        webPreferences: {
            preload: getPreloadPath(),
        },
    });
    if (isDev()) {
        mainWindow.loadURL("http://localhost:5123");
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
    }
});

// Upload de arquivos
ipcMain.handle('open-dialog', async (event, { method, format, config }) => {
    if (method === 'showOpenDialog') {
        const result = await dialog.showOpenDialog(config);
        if (!result.canceled && result.filePaths.length > 0) {
            const molObjects = result.filePaths.map(filePath => {
                try {
                    const data = fs.readFileSync(filePath, 'utf8');
                    const fileName = path.basename(filePath);              
                    const fileFormat = path.extname(filePath).substring(1); // Determina o formato do arquivo com base na extensão do arquivo
                    let destinationDir;
                    if (format === 'receptor') {
                        destinationDir = path.join(__dirname, '../temp/receptors');
                    } else if (format === 'ligand') {
                        destinationDir = path.join(__dirname, '../temp/ligands');
                    } else {
                        throw new Error(`Invalid format: ${format}`);
                    }

                    const destinationPath = path.join(destinationDir, fileName);

                    // Cria o diretório de destino, se não existir
                    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });

                    // Copia o arquivo para o diretório destino
                    fs.copyFileSync(filePath, destinationPath);

                    return {
                        name: fileName,
                        data: data,
                        format: fileFormat,
                        filePath: destinationPath // Adiciona o caminho do arquivo copiado ao objeto
                    };
                } catch (error) {
                    console.error('Erro ao ler ou copiar o arquivo:', error);
                    throw error;
                }
            });

            return molObjects; // Retorna uma lista de objetos com informações sobre os arquivos
        } else {
            // Retornar um valor indicando que nenhum arquivo foi selecionado
            return null;
        }
    }

    throw new Error(`Invalid dialog method: ${method}`);
});