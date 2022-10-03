import * as WebSocket from 'ws';
import {ConnectionProvider} from './connection-provider';
import {Record} from '../interface/record.interface';
import {Response} from '../interface/response.interface';
import {AuthenticationException} from '../exception/authentication.exception';
import {UnknownException} from '../exception/unknown.exception';
import {RequestQueue} from 'src/interface/request-queue.interface';

/**
 * @class ConnectionHandler
 */
export class ConnectionHandler {
  /**
   * Store exceptions by error codes
   *
   * @type {{code: number, exception: Error}[]}
   */
  private _exceptions: {code: number; exception: Error}[] = [
    {
      code: -32000,
      exception: new AuthenticationException(),
    },
  ];

  /**
   * @type {string}
   */
  private _id = '0';

  /**
   * @type {boolean}
   */
  private _isConnected = false;

  /**
   * Store results of sent objects
   *
   * @type {{[key: number]: string}}
   */
  private _records: {[key: number]: string} = {};

  /**
   * Contains requests that are queued up
   *
   * @type {RequestQueue}
   */
  private _holdingQueue: RequestQueue = {};

  /**
   * NOTICE we could use NodeJS.Timer here, but I guess it would prevent
   * to run in browser
   *
   * @type {any}
   */
  private _pingInterval: any;

  /**
   * ConnectionHandler constructor
   *
   * @constructor
   * @param {ConnectionProvider} provider
   */
  constructor(public readonly provider: ConnectionProvider) {
    this.assignEvents();
  }

  /**
   * @private
   */
  private assignEvents(): void {
    this.provider.connection.addEventListener('open', () => this.onOpen());
    this.provider.connection.addEventListener('error', (e: any) =>
      this.onError(e)
    );
    this.provider.connection.addEventListener('open', (e: any) =>
      this.onClose(e)
    );
  }

  /**
   * @private
   * @async
   * @returns {Promise<string>}
   */
  private async generateID(): Promise<string> {
    return new Promise<string>((res) =>
      res(
        (this._id = (
          (Number(this._id) + 1) %
          Number.MAX_SAFE_INTEGER
        ).toString())
      )
    );
  }

  /**
   * Send payload to Surreal
   *
   * @private
   * @async
   * @param record Payload
   * @returns {Promise<any>}
   */
  private async sendPayload(record: Record): Promise<any> {
    return new Promise((resolve) => {
      this.provider.connection.send(JSON.stringify(record));

      this.provider.connection.onmessage = async (e) => {
        await this.handleMessage(e);

        resolve(this._records[Number(record.id)] as any);
      };
    });
  }

  /**
   * Generates payload
   *
   * @public
   * @param {string} method
   * @param {string} params
   * @returns {Promise<K>}
   */
  public async send<T, K = any>(method: string, params?: T): Promise<K> {
    const record: Record = {
      id: await this.generateID(),
      method,
      params: Array.isArray(params) ? params : [params],
    };

    if (!this.provider.connection || !this._isConnected) {
      return new Promise(
        (resolve) => (this._holdingQueue[Number(record.id)] = {record, resolve})
      );
    }

    return (await this.sendPayload(record)) as K;
  }

  /**
   * Handle incoming message
   *
   * @public
   * @async
   * @param {WebSocket.MessageEvent} e
   */
  public async handleMessage(e: WebSocket.MessageEvent): Promise<void> {
    const response = JSON.parse(e.data as string) as Response;

    if ('error' in response) {
      const exception = this._exceptions.filter(
        (e) => response.error.code === e.code
      );

      if (!exception || exception.length === 0) {
        throw new UnknownException(response.error.code, response.error.message);
      }

      throw exception[0].exception;
    }

    if (!('id' in response) && !('result' in response)) {
      return;
    }

    const requestId = Number(response.id);

    const result = (this._records[Number(response.id)] = response.result);
    const queuedRequest = this._holdingQueue[requestId];

    if (queuedRequest) {
      queuedRequest.resolve(result);
    }
  }

  /**
   * Close connection
   *
   * @public
   * @async
   * @returns {Promise<void>}
   */
  public async close(): Promise<void> {
    return new Promise<void>(() => {
      this.provider.connection.close();
    });
  }

  /**
   * Handle error
   *
   * @public
   * @param {any} e
   */
  public onError(e: any): void {}

  /**
   * Handle close
   *
   * @public
   * @param {any} e
   */
  public onClose(e: any): void {
    if (this._pingInterval) {
      clearInterval(this._pingInterval);
    }
  }

  /**
   * Handle open
   *
   * @public
   */
  public onOpen(): void {
    this._isConnected = true;

    if (!this._pingInterval) {
      this._pingInterval = setInterval(
        async () => await this.send('ping'),
        30000
      );
    }

    if (Object.keys(this._holdingQueue).length > 0) {
      Object.keys(this._holdingQueue).forEach(async (e) => {
        await this.sendPayload(this._holdingQueue[e].record);
        delete this._holdingQueue[e];
      });
    }
  }
}
