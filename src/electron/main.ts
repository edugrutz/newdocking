import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import fs from "fs";
import { isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
import { resourceLimits } from "worker_threads";

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
    if (method === 'upload')
    {
        const files = await dialog.showOpenDialog(config);

        if (files.canceled && files.filePaths.length === 0) return null;
        const dataFiles = files.filePaths.map((filePath) => {
            try
            {
                const file = files.filePaths[0];
                const data = fs.readFileSync(file, 'utf8');
                const fileName = path.basename(file);

            let destinationDir;
            if (format === 'receptor') {
                destinationDir = path.join(__dirname, '../temp/receptors');
            } else if (format === 'ligand') {
                destinationDir = path.join(__dirname, '../temp/ligands');
            } else {
                throw new Error(`Invalid format: ${format}`);
            }

            const destinationPath = path.join(destinationDir, fileName);
            fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
            fs.copyFileSync(filePath, destinationPath);

                return {
                    name: fileName,
                    data: data,
                    format: format,
                    filePath: destinationPath,
                };
            } catch (error)
            {
                console.error(error);
                return null;
            }
        });
        return dataFiles;
    } else
    {
        return null;
        console.log('Método não suportado');
    }
});

//Listar arquivos da pasta temp
ipcMain.handle('listFiles', async (event) => {
    const receptorDir = path.join(__dirname, '../temp/receptors');
    const ligandDir = path.join(__dirname, '../temp/ligands');
    const resultsDir = path.join(__dirname, '../temp/results');
    let receptorFiles: string[] = [];
    let ligandFiles: string[] = [];
    let resultsFiles: string[] = [];

    try
    {
        receptorFiles = fs.readdirSync(receptorDir);
        ligandFiles = fs.readdirSync(ligandDir);
        resultsFiles = fs.readdirSync(resultsDir);
    } catch (error)
    {
        console.error(error);
    }

    return {
        receptorFiles,
        ligandFiles,
        resultsFiles,
    };
});