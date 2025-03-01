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
    getOutputPath: (filename: string) => ipcInvoke('get-output-path', filename),
} satisfies Window['electron']);

function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key,
    payload?: EventPayloadMapping[Key]
  ): Promise<EventPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key, payload);
  }