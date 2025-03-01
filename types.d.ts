type EventPayloadMapping = {
    'open-dialog': { method: string; config: any };
    'get-static-data': any;
    'listFiles': any;
    'getFiles': any;
    'dellFile': { filePath: string };
    'spawn': { command: string; args: string[] };
    'get-resource-path': string;
    'find-file': { type: string; fileName: string };
    'get-output-path': { type: string; filename: string };
    'split-result': { result: string };
    
};

interface Window {
    electron: {
        getStaticData: () => void;
        openDialog: (method: string, format:string, config: any) => Promise<any>;
        listFiles: () => Promise<any>;
        getFiles: () => Promise<any>;
        dellFile: (filePath: string) => Promise<any>;
        spawn: (command: string, args: string[]) => Promise<any>;
        getResourcePath: (filename: string) => Promise<string>;
        findFile: (type: string, fileName: string) => Promise<any>;
        getOutputPath: (type: string, filename: string) => Promise<any>;
        splitResult: (result: string) => Promise<any>;
    };
}