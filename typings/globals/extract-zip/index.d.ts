declare module 'extract-zip' {
    function extract(source: string, options: extract.Options, callback: (err: Error) => void): void;

    namespace extract {
        interface Options {
            dir: string;
            defaultDirMode: number;
            defaultFileMode: number;
            onEntry: (entry: any) => void;
            strip: number;
        }
    }

    export  = extract;
}
