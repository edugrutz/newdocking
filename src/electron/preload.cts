import { ipcRenderer } from "electron";

const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
    getStaticData: () => { console.log('static'); },
    openDialog: (method: string, format: string, config: any) => ipcInvoke('open-dialog', { method, format, config } as { method: string; format: string; config: any }),
    listFiles: () => ipcInvoke('listFiles', {}),
    getFiles: () => ipcInvoke('getFiles', {}),
    dellFile: (filePath: string) => ipcInvoke('dellFile', { filePath }),
    spawn: (command: string, args: string[]) => ipcInvoke('spawn', { command, args }),
    getResourcePath: (filename: string) => ipcInvoke('get-resource-path', filename),
    findFile: (type: string, fileName: string) => ipcInvoke('find-file', { type, fileName }),
    getOutputPath: (type: string, filename: string) => ipcInvoke('get-output-path', { type, filename }),
    splitResult: (result: string) => ipcInvoke('split-result', { result }),
    generateConfigFile: (centerBox: number[], sizeBox: number[]) => ipcInvoke('generate-config-file', { centerBox, sizeBox }),
    listSplit: () => ipcInvoke('listSplit', {}),
    copyReceptor: (receptorPath: string, filename: string) => ipcInvoke('copy-receptor', { receptorPath, filename }),
    getReceptor: (resultname: string) => ipcInvoke('get-receptor', { resultname }),
    getTempsFolderPath: (folderName: string) => ipcInvoke('get-temps-folder-path', { folderName }),
    } satisfies Window['electron']);

function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key,
    payload?: EventPayloadMapping[Key]
  ): Promise<EventPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key, payload);
  }