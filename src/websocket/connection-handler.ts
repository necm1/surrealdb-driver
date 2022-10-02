import {AuthenticationException} from '../exception/authentication.exception';
import {UnknownException} from '../exception/unknown.exception';
import {ConnectionProvider} from './connection-provider';
import * as WebSocket from 'ws';

/**
 * @class ConnectionHandler
 */
export class ConnectionHandler {
  /**
   * @type {boolean}
   */
  private _authenticated = false;

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
   * Store results of send objects
   *
   * @type {Record<number, any>}
   */
  private _records: {[key: number]: string} = {};

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
   * Send data to SurrealDB
   *
   * @public
   * @param {string} method
   * @param {string} params
   * @returns {Promise<K>}
   */
  public async send<T, K = any>(method: string, params?: T): Promise<K> {
    if (!this.provider.connection || !this._isConnected) {
      console.log('test');
      return new Promise<K>((resolve) => resolve({} as K));
    }

    const request = {
      id: await this.generateID(),
      method,
      params: params ? (Array.isArray(params) ? params : [params]) : undefined,
    };

    this._records[Number(request.id)] = '';

    this.provider.connection.send(JSON.stringify(request));

    this.provider.connection.onmessage = async (e) => {
      await this.handleMessage(e);
    };

    return this._records[Number(request.id)] as K;
  }

  /**
   * Handle incoming message
   *
   * @private
   * @async
   * @param {WebSocket.MessageEvent} e
   */
  private async handleMessage(e: WebSocket.MessageEvent): Promise<void> {
    const response = JSON.parse(e.data as string);

    console.log(`RPC > Receiving: ${JSON.stringify(response)}`);

    if ('error' in response) {
      const exception = this._exceptions.filter(
        (e) => response.error.code === e.code
      );

      if (!exception || exception.length === 0) {
        throw new UnknownException(response.error.code, response.error.message);
      }

      if (exception[0].exception instanceof AuthenticationException) {
        this._authenticated = false;
      }

      throw exception[0].exception;
    }

    if ('id' in response && 'result' in response) {
      this._records[Number(response.id)] = response.result;
    }
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
  public onClose(e: any): void {}

  /**
   * Handle open
   *
   * @public
   */
  public onOpen(): void {
    this._isConnected = true;
  }
}
