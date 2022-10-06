import { ClientOptions } from '../interface/client-options.interface';
import * as WebSocket from 'ws';
export declare class ConnectionProvider {
    private readonly options;
    private _ws;
    constructor(options: ClientOptions);
    getEndpoint(): string;
    get connection(): WebSocket;
}
