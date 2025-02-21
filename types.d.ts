type EventPayloadMapping = {
    'open-dialog': { method: string; config: any };
    'get-static-data': any;
};

interface Window {
    electron: {
        getStaticData: () => void;
        openDialog: (method: string, format:string, config: any) => Promise<any>;
    };
}