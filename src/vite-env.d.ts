export { };

declare global {
    interface Window {
        electronAPI?: {
            minimize: () => Promise<void>;
            maximize: () => Promise<void>;
            close: () => Promise<void>;
            selectFolder: () => Promise<string | null>;
            scanFolder: (path: string) => Promise<any[]>;
            getStoreValue: (key: string) => Promise<any>;
            setStoreValue: (key: string, value: any) => Promise<void>;
            onTrayCommand: (callback: (command: string) => void) => () => void;
        };
    }
}
