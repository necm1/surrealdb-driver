export interface ClientOptions {
    host: string;
    port: number;
    user: string;
    pass: string;
    db: string;
    ns: string;
    ssl: boolean;
    logger?: {
        log?: boolean;
        factory: ClientOptionsLogger;
    };
}
export interface ClientOptionsLogger {
    log?: Function;
    error?: Function;
}
