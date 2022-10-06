import * as WebSocket from 'ws';
import { ConnectionProvider } from './connection-provider';
import { ClientOptionsLogger } from '../interface/client-options.interface';
export declare class ConnectionHandler {
    readonly provider: ConnectionProvider;
    private readonly logger?;
    private _exceptions;
    private _id;
    private _isConnected;
    private _records;
    private _holdingQueue;
    private _pingInterval;
    constructor(provider: ConnectionProvider, logger?: ClientOptionsLogger);
    private assignEvents;
    private generateID;
    private sendPayload;
    send<T, K = any>(method: string, params?: T): Promise<K>;
    handleMessage(e: WebSocket.MessageEvent): Promise<void>;
    close(): Promise<void>;
    onError(e: any): void;
    onClose(e: any): void;
    onOpen(): void;
}
