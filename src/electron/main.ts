import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import fs from "fs";
import { isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
import { resourceLimits } from "worker_threads";
import { spawn } from 'child_process';
import { get } from "http";

//app.disableHardwareAcceleration();

function createAppDirectories() {
    const baseDir = process.env.NODE_ENV === 'development' 
      ? path.join(__dirname, '../../temp')
      : path.join(app.getPath('userData'), 'temp');
  
    const requiredDirs = [
      'results',
      'ligands',
      'temp',
      'resultRec',
      'temp/split'
    ];
  
    requiredDirs.forEach(dir => {
      const fullPath = path.join(baseDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });
  }

  app.whenReady().then(createAppDirectories);

// Diretório atual
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Cria a janela e configurações principais
app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
            devTools: true,
        },
    });

    mainWindow.maximize();

    if (isDev()) {
        mainWindow.loadURL("http://localhost:5123");
        mainWindow.webContents.openDevTools();
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
                if (isDev()) {
                    destinationDir = path.join(__dirname, '../temp/receptors');
                } else {
                    destinationDir = path.join(app.getPath('userData'), 'temp/receptors');
                }
            } else if (format === 'ligand') {
                if (isDev()) {
                    destinationDir = path.join(__dirname, '../temp/ligands');
                } else {
                    destinationDir = path.join(app.getPath('userData'), 'temp/ligands');
                }
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

// Listar resultados splitados
ipcMain.handle('listSplit', async (event) => {
    let splitDir;
    if (isDev()) {
        splitDir = path.join(__dirname, '../temp/temp/split');
    }
    else {
        splitDir = path.join(app.getPath('userData'), 'temp/temp/split');
    }
    
    let fileContents: { name: string, data: string }[] = [];
    try {
        const files = fs.readdirSync(splitDir);
        fileContents = files.map((file) => {
            const fullPath = path.join(splitDir, file);
            const data = fs.readFileSync(fullPath, 'utf8');
            return {
                name: file,  
                data: data,
                filePath: fullPath,    
            };
        });
    } catch (error) {
        console.error(error);
    }

    return fileContents; 
});

// Pegar arquivos e data
ipcMain.handle('getFiles', async (event) => {
    let receptorDir;
    let ligandDir;
    let resultsDir;

    if (isDev()) {
        receptorDir = path.join(__dirname, '../temp/receptors');
        ligandDir = path.join(__dirname, '../temp/ligands');
        resultsDir = path.join(__dirname, '../temp/results');
    } else {
        receptorDir = path.join(app.getPath('userData'), 'temp/receptors');
        ligandDir = path.join(app.getPath('userData'), 'temp/ligands');
        resultsDir = path.join(app.getPath('userData'), 'temp/results');
    }
    
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

    const resultsData = resultsFiles.map((file) => {
        const data = fs.readFileSync(path.join(resultsDir, file), 'utf8');
        const filePath = path.join(resultsDir, file);
        return {
            name: file,
            data: data,
            filePath: filePath,
        };
    });

    return {
        resultsData,
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
        if (command === 'obabel' || command === 'prepare_receptor' || command === 'mk_prepare_ligand' || command === 'vina') {
            command = getResourcePath(command);
        }

        console.log('Spawn:', command, args);
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
    if (!fileName) {
        throw new Error('Name is required');
    }
    let filePath = "";
    switch (type) {
        case 'receptor':
            isDev() ? filePath = path.join(__dirname, '../temp/receptors', fileName) : filePath = path.join(app.getPath('userData'), 'temp/receptors', fileName);
            break;
        case 'ligand':
            isDev() ? filePath = path.join(__dirname, '../temp/ligands', fileName) : filePath = path.join(app.getPath('userData'), 'temp/ligands', fileName);
            break;
        case 'result':
            isDev() ? filePath = path.join(__dirname, '../temp/results', fileName) : filePath = path.join(app.getPath('userData'), 'temp/results', fileName);
            break;
        case 'temp':
            isDev() ? filePath = path.join(__dirname, '../temp/temp', fileName) : filePath = path.join(app.getPath('userData'), 'temp/temp', fileName);
            break;
        case 'resultRec':
            isDev() ? filePath = path.join(__dirname, '../temp/resultRec', fileName) : filePath = path.join(app.getPath('userData'), 'temp/resultRec', fileName);
            break;
        default:
            throw new Error(`Invalid type: ${type}`);
    }
    return filePath;
});

// Obtém o caminho de saída
ipcMain.handle('get-output-path', async (event, {type, filename}) => {
    switch (type) {
        case 'results':
            if (isDev()) {
                return path.join(__dirname, '../temp/results', filename);
            } else {
                return path.join(app.getPath('userData'), 'temp/results', filename);
            }
            break;
        case 'temp':
            if (isDev()) {
                return path.join(__dirname, '../temp/temp', filename);
            } else {
                return path.join(app.getPath('userData'), 'temp/temp', filename);
            }
            break;
        default:
            throw new Error(`Invalid type: ${type}`);
    }
});

function or(arg0: boolean) {
    throw new Error("Function not implemented.");
}

// Split result
ipcMain.handle('split-result', async (event, { result }) => {

    const resultName = path.basename(result);
    let outputDir;
    let outputPath;
    if (isDev()) {
        outputDir = path.join(__dirname, '../temp/temp/split');
        outputPath = path.join(__dirname, '../temp/temp/split', resultName);
    } else {
        outputDir = path.join(app.getPath('userData'), 'temp/temp/split');
        outputPath = path.join(app.getPath('userData'), 'temp/temp/split', resultName);
    }
    const vina_split = getResourcePath('vina_split');

    // Limpa a pasta
    fs.readdirSync(outputDir).forEach(file => {
        fs.unlinkSync(`${outputDir}/${file}`);
      });
    
    fs.copyFileSync(result, outputPath); 
    const process = spawn(vina_split, ['--input', outputPath], { cwd: outputDir });

});

// Gerar config.txt
ipcMain.handle('generate-config-file', async (event, { centerBox, sizeBox }) => {

    let outputPath;
    if (isDev()) {
        outputPath = path.join(__dirname, '../temp/temp/config.txt');
    } else {
        outputPath = path.join(app.getPath('userData'), 'temp/temp/config.txt');
    }

    return new Promise((resolve, reject) => {
        const boxconfig = getResourcePath('boxConfig.py');
        const args = [boxconfig,...centerBox, ...sizeBox, outputPath];
        const process = spawn('python3', args);

        process.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        process.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        process.on('close', (code) => {
            if (code === 0) {
                resolve({ code, outputPath });
            } else {
                reject(new Error(`Process exited with code ${code}`));
            }
        });

        process.on('error', (error) => {
            reject(error);
        });
    });
});

// Copiar receptor
ipcMain.handle('copy-receptor', async (event, { receptorPath, filename }) => {
    let outputDir;
    if (isDev()) {
        outputDir = path.join(__dirname, '../temp/resultRec');
    } else {
        outputDir = path.join(app.getPath('userData'), 'temp/resultRec');
    }
    const outputPath = path.join(outputDir, filename);

    fs.copyFileSync(receptorPath, outputPath);

    return outputPath;
});

// Pegar conteudo do receptor do resultado
ipcMain.handle('get-receptor', async (event, {resultname}) => {
    if (!resultname) {
        throw new Error('resultName is required');
    }
    let resultPath;
    if (isDev()) {
        resultPath = path.join(__dirname, '../temp/resultRec', resultname);
    } else {
        resultPath = path.join(app.getPath('userData'), 'temp/resultRec', resultname);
    }
    return fs.readFileSync(resultPath, 'utf8');
});

// Pegar o caminho da pasta temp
ipcMain.handle('get-temps-folder-path', async (event, { folderName }) => {
    if (isDev()) {
        return path.join(__dirname, '../temp', folderName);
    } else {
        return path.join(app.getPath('userData'), 'temp', folderName);
    }
}
);

// Backend (Electron)
ipcMain.handle('download-result', async (event, {filepath}) => {
    try {
        if (!filepath) throw new Error('Caminho do arquivo não especificado');
        
        const window = BrowserWindow.getFocusedWindow();
        if (!window) throw new Error('No focused window');

        const { filePath } = await dialog.showSaveDialog(window, {
            title: 'Salvar arquivo',
            defaultPath: filepath,
            buttonLabel: 'Salvar',
            filters: [
                { name: 'PDB Files', extensions: ['pdb'] },
                { name: 'All Files', extensions: ['*'] }
            ],
        });

        if (!filePath) return { success: false };

        fs.copyFileSync(filepath, filePath);
        return { success: true, filePath };
    } catch (error) {
        console.error('Erro ao baixar o arquivo:', error);
        return { success: false, error: (error as Error).message };
    }
});