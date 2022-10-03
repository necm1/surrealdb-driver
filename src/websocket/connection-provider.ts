import {ClientOptions} from '../interface/client-options.interface';
import * as WebSocket from 'ws';

/**
 * @class ConnectionProvider
 */
export class ConnectionProvider {
  /**
   * WebSocket instance
   *
   * @type {WebSocket}
   */
  private _ws: WebSocket = new WebSocket(this.getEndpoint());

  /**
   * Client constructor
   *
   * @constructor
   * @param {ClientOptions} options
   */
  constructor(private readonly options: ClientOptions) {}

  /**
   * @returns {Promise<string>}
   */
  public getEndpoint(): string {
    return `${this.options.ssl ? 'wss' : 'ws'}://${this.options.host}:${
      this.options.port
    }/rpc`;
  }

  /**
   * @returns {WebSocket}
   */
  public get connection(): WebSocket {
    return this._ws;
  }
}
