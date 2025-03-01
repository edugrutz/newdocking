import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import fs from "fs";
import { isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
import { resourceLimits } from "worker_threads";
import { spawn } from 'child_process';

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

// Pegar arquivos e data
ipcMain.handle('getFiles', async (event) => {
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

    const receptorData = receptorFiles.map((file) => {
        const data = fs.readFileSync(path.join(receptorDir, file), 'utf8');
        const format = path.extname(file).substring(1);
        const filePath = path.join(receptorDir, file);
        return {
            name: file,
            data: data,
            format: format,
            filePath: filePath,
        };
    });

    const ligandData = ligandFiles.map((file) => {
        const data = fs.readFileSync(path.join(ligandDir, file), 'utf8');
        const format = path.extname(file).substring(1);
        const filePath = path.join(ligandDir, file);
        return {
            name: file,
            data: data,
            format: format,
            filePath: filePath,
        };
    });

    return {
        resultsFiles,
        receptorData,
        ligandData,
    };
});

// Deletar arquivos
ipcMain.handle('dellFile', async (event, { filePath }) => {
    try
    {
        fs.unlinkSync(filePath);
        return true;
    } catch (error)
    {
        console.error(error);
        return false;
    }
});

// Acha o arquivo na resources
function getResourcePath(filename: string): string {
    return app.isPackaged
        ? path.join(process.resourcesPath, 'resources', filename) // Caminho no build
        : path.join(__dirname, '../resources', filename); // Caminho no dev
}

// Spawn process
ipcMain.handle('spawn', async (event, { command, args }) => {
    return new Promise((resolve, reject) => {
        // Se o comando for 'obabel', encontre o caminho correto
        if (command === 'obabel') {
            command = getResourcePath(command);
        }
        if (command === 'mk_prepare_ligand.py') {
            command = getResourcePath(command);
        }

        const process = spawn(command, args);

        let output = '';
        process.stdout.on('data', (data) => {
            output += data.toString();
        });

        process.stderr.on('data', (data) => {
            output += data.toString();
        });

        process.on('close', (code) => {
            resolve({ code, output });
        });

        process.on('error', (error) => {
            reject(error);
        });
    });
});

// Achar o caminho do ligante, receptor ou resultado
ipcMain.handle('find-file', async (event, { type, fileName }) => {
    console.log('find-file:', { type, fileName });
    if (!fileName) {
        throw new Error('Name is required');
    }
    let filePath = "";
    switch (type) {
        case 'receptor':
            filePath = path.join(__dirname, '../temp/receptors', fileName);
            break;
        case 'ligand':
            filePath = path.join(__dirname, '../temp/ligands', fileName);
            break;
        case 'result':
            filePath = path.join(__dirname, '../temp/results', fileName);
            break;
        default:
            throw new Error(`Invalid type: ${type}`);
    }
    return filePath;
});

// Obtém o caminho de saída
ipcMain.handle('get-output-path', async (event, filename: string) => {
    return path.join(__dirname, '../temp/temp', filename);
});