import { ipcRenderer } from "electron";

const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
    getStaticData: () => { console.log('static'); },
    openDialog: (method: string, format: string, config: any) => ipcInvoke('open-dialog', { method, format, config } as { method: string; format: string; config: any }),
} satisfies Window['electron']);

function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key,
    payload?: EventPayloadMapping[Key]
  ): Promise<EventPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key, payload);
  }