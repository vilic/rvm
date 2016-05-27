declare module "node-fetch" {
    enum RequestContext {
        "audio", "beacon", "cspreport", "download", "embed", "eventsource",
        "favicon", "fetch", "font", "form", "frame", "hyperlink", "iframe",
        "image", "imageset", "import", "internal", "location", "manifest",
        "object", "ping", "plugin", "prefetch", "script", "serviceworker",
        "sharedworker", "subresource", "style", "track", "video", "worker",
        "xmlhttprequest", "xslt"
    }
    enum RequestMode { "same-origin", "no-cors", "cors" }
    enum RequestCredentials { "omit", "same-origin", "include" }
    enum RequestCache {
        "default", "no-store", "reload", "no-cache", "force-cache",
        "only-if-cached"
    }
    enum ResponseType { "basic", "cors", "default", "error", "opaque" }

    type HeaderInit = Headers | Array<string>;
    type BodyInit = ArrayBuffer | ArrayBufferView | Blob | FormData | string;
    type RequestInfo = Request | string;

    interface RequestInit {
        method?: string;
        headers?: HeaderInit | { [index: string]: string };
        body?: BodyInit;
        mode?: string | RequestMode;
        credentials?: string | RequestCredentials;
        cache?: string | RequestCache;
    }

    interface IHeaders {
        get(name: string): string;
        getAll(name: string): Array<string>;
        has(name: string): boolean;
    }

    class Headers implements IHeaders {
        append(name: string, value: string): void;
        delete(name: string):void;
        get(name: string): string;
        getAll(name: string): Array<string>;
        has(name: string): boolean;
        set(name: string, value: string): void;
    }

    interface IBody {
        bodyUsed: boolean;
        body: NodeJS.ReadableStream;
        formData(): Promise<FormData>;
        json(): Promise<any>;
        json<T>(): Promise<T>;
        text(): Promise<string>;
    }

    class Body implements IBody {
        bodyUsed: boolean;
        body: NodeJS.ReadableStream;
        formData(): Promise<FormData>;
        json(): Promise<any>;
        json<T>(): Promise<T>;
        text(): Promise<string>;
    }

    interface IRequest extends IBody {
        method: string;
        url: string;
        headers: Headers;
        context: string | RequestContext;
        referrer: string;
        mode: string | RequestMode;
        credentials: string | RequestCredentials;
        cache: string | RequestCache;
    }

    class Request extends Body implements IRequest {
        constructor(input: string | Request, init?: RequestInit);
        method: string;
        url: string;
        headers: Headers;
        context: string | RequestContext;
        referrer: string;
        mode: string | RequestMode;
        credentials: string | RequestCredentials;
        cache: string | RequestCache;
    }

    interface IResponse extends IBody {
        url: string;
        status: number;
        statusText: string;
        ok: boolean;
        headers: IHeaders;
        type: string | ResponseType;
        size: number;
        timeout: number;
        redirect(url: string, status: number): IResponse;
        error(): IResponse;
        clone(): IResponse;
    }

    interface IFetchStatic {
        Promise: any;
        Headers: IHeaders
        Request: IRequest;
        Response: IResponse;
        (url: string | IRequest, init?: RequestInit): Promise<IResponse>;
    }

    var fetch: IFetchStatic;

    export = fetch;
}
