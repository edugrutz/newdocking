type EventPayloadMapping = {
    'open-dialog': { method: string; config: any };
    'get-static-data': any;
    'listFiles': any;
    'getFiles': any;
    'dellFile': { filePath: string };
};

interface Window {
    electron: {
        getStaticData: () => void;
        openDialog: (method: string, format:string, config: any) => Promise<any>;
        listFiles: () => Promise<any>;
        getFiles: () => Promise<any>;
        dellFile: (filePath: string) => Promise<any>;
    };
}