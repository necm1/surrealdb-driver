import {ClientOptions} from 'src/interface/client-options.interface';
import * as WebSocket from 'ws';
import {ConnectionHandler} from './connection-handler';

/**
 * @class ConnectionProvider
 */
export class ConnectionProvider {
  /**
   * WebSocket instance
   *
   * @type {WebSocket}
   */
  private _ws: WebSocket;

  /**
   * @type {ConnectionHandler}
   */
  private connectionHandler: ConnectionHandler = new ConnectionHandler();

  /**
   * @type {[key: string]: Function}
   */
  private handlerMethods: {[key: string]: Function} = {
    error: this.connectionHandler.onError,
    open: this.connectionHandler.onOpen,
    close: this.connectionHandler.onClose,
  };

  /**
   * Client constructor
   *
   * @constructor
   * @param {ClientOptions} options
   */
  constructor(private readonly options?: ClientOptions) {
    this._ws = new WebSocket(this.getEndpoint());

    this.assignEvents();
  }

  /**
   * @private
   */
  private assignEvents(): void {
    Object.keys(this.handlerMethods).forEach((e) =>
      this._ws.addEventListener(e, this.handlerMethods[e].bind(this))
    );
  }

  /**
   * @returns {string}
   */
  public getEndpoint(): string {
    if (this.options) {
      return `${this.options.ssl ? 'wss' : 'ws'}://${this.options.host}:${
        this.options.port
      }/rpc`;
    }

    return `${Boolean(JSON.parse(process.env.SURREAL_SSL)) ? 'wss' : 'ws'}://${
      process.env.SURREAL_HOST
    }:${process.env.SURREAL_PORT}/rpc`;
  }

  /**
   * @returns {WebSocket}
   */
  public get connection(): WebSocket {
    return this._ws;
  }
}
