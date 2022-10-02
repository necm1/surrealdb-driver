import * as dotenv from 'dotenv';
import {ClientOptions} from './interface/client-options.interface';
import {ConnectionHandler} from './websocket/connection-handler';
import {ConnectionProvider} from './websocket/connection-provider';

export class Surreal {
  /**
   * @type {ConnectionHandler}
   */
  private _connectionHandler: ConnectionHandler;

  /**
   * Surreal constructor
   *
   * @constructor
   */
  constructor(private readonly options?: ClientOptions) {
    dotenv.config();

    const provider = new ConnectionProvider(options);
    this._connectionHandler = new ConnectionHandler(provider);

    provider.connection.on('open', async () => {
      await this.signIn();
    });
  }

  /**
   * @private
   * @async
   * @returns {Promise<string>}
   */
  private async signIn(): Promise<string> {
    const result = await this._connectionHandler.send<
      {
        NS: string;
        DB: string;
        user: string;
        pass: string;
      },
      string
    >('signin', {
      NS: this.options?.ns ?? process.env.SURREAL_NS,
      DB: this.options?.db ?? process.env.SURREAL_DB,
      user: this.options?.user ?? process.env.SURREAL_USER,
      pass: this.options?.pass ?? process.env.SURREAL_PASS,
    });

    return new Promise<string>((resolve, reject) => {
      if (!result) {
        reject;
      }

      resolve(result);
    });
  }

  /**
   * Select table or record
   *
   * @public
   * @async
   * @param table Table or record name
   * @returns {Promise<T>}
   */
  public async select<T>(table: string): Promise<T> {
    return await this._connectionHandler.send<string, T>('select', table);
  }
}

(async () => {
  const surreal = new Surreal();
})();
