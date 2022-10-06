import {ClientOptions} from './interface/client-options.interface';
import {ConnectionHandler} from './websocket/connection-handler';
import {ConnectionProvider} from './websocket/connection-provider';

/**
 * @class Surreal
 */
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
  constructor(private readonly options: ClientOptions) {
    this._connectionHandler = new ConnectionHandler(
      new ConnectionProvider(options),
      options.logger && options.logger.log ? options.logger.factory : undefined
    );
  }

  /**
   * Close connection
   *
   * @public
   * @async
   * @returns {Promise<void>}
   */
  public async close(): Promise<void> {
    return this._connectionHandler.close();
  }

  /**
   * Sign in to SurrealDB with given data
   *
   * @public
   * @async
   * @returns {Promise<string>}
   */
  public async signIn(): Promise<string> {
    return await this._connectionHandler.send<
      {
        NS: string;
        DB: string;
        user: string;
        pass: string;
      },
      string
    >('signin', {
      NS: this.options.ns,
      DB: this.options.db,
      user: this.options.user,
      pass: this.options.pass,
    });
  }

  /**
   * Switch to a specific namespace & database
   *
   * @public
   * @async
   * @param ns Namespace name
   * @param db Database name
   */
  public async use(ns: string, db: string): Promise<void> {
    await this._connectionHandler.send<string[]>('use', [ns, db]);
  }

  /**
   * Get information about current Surreal instance
   *
   * @public
   * @async
   * @returns {Promise<void>}
   */
  public async info(): Promise<void> {
    await this._connectionHandler.send('info');
  }

  /**
   * @public
   * @async
   * @param {string} table
   * @returns {Promise<string>}
   */
  public async live(table: string): Promise<string> {
    return await this._connectionHandler.send('live', table);
  }

  /**
   * Kill specific query
   *
   * @public
   * @async
   * @param {string} query
   *
   */
  public async kill(query: string): Promise<void> {
    await this._connectionHandler.send('kill', query);
  }

  /**
   * Creates a variable
   *
   * @public
   * @async
   * @param {string} key Name of variable
   * @param {string} value Value of variable
   * @returns {Promise<void>}
   */
  public async let(key: string, value: string): Promise<void> {
    await this._connectionHandler.send<string[]>('let', [key, value]);
  }

  /**
   * Run query statement
   *
   * @public
   * @async
   * @param {string} query Query statement
   * @param {[key: string]: any} vars Query variables used in statement
   * @returns {Promise<T>}
   */
  public async query<T>(query: string, vars: {[key: string]: any}): Promise<T> {
    return await this._connectionHandler.send<
      [string, {[key: string]: any}],
      T
    >('query', [query, vars]);
  }

  /**
   * Select table or record
   *
   * @public
   * @async
   * @param {string} table Table / Record name
   * @returns {Promise<T[]>}
   */
  public async select<T>(table: string): Promise<T[]> {
    return await this._connectionHandler.send<string, T[]>('select', table);
  }

  /**
   * Create record
   *
   * @public
   * @async
   * @param {string} table Table / Record name
   * @param {T | undefined} data Data to create
   */
  public async create<T extends Record<string, unknown>>(
    table: string,
    data?: T
  ): Promise<T> {
    return await this._connectionHandler.send<[string, T], T>('create', [
      table,
      data,
    ]);
  }

  /**
   * Update record(s) in table
   *
   * @public
   * @async
   * @param {string} table Table / Record name
   * @param {T | undefined} data Data to create
   */
  public async update<T extends Record<string, unknown>>(
    table: string,
    data?: T
  ): Promise<T> {
    return await this._connectionHandler.send<[string, T], T>('update', [
      table,
      data,
    ]);
  }

  /**
   * TODO add method description
   *
   * @public
   * @async
   * @param {string} table Table / Record name
   * @param {string} data Data to change
   * @returns {Promise<(T & K) | (T & K)[]>}
   */
  public async change<T extends Record<string, unknown>, K = T>(
    table: string,
    data?: Partial<T> & K
  ): Promise<(T & K) | (T & K)[]> {
    // TODO check types & refactor if needed
    return await this._connectionHandler.send<[string, (T & K) | (T & K)[]]>(
      'change',
      [table, data as any]
    );
  }

  /**
   * @public
   * @async
   * @param {string} table Table / Record name
   * @param {string} data Data to modify records
   */
  public async modify(table: string, data?: any): Promise<any> {
    return await this._connectionHandler.send<[string, any], any>('modify', [
      table,
      data,
    ]);
  }

  /**
   * Delete specific or all record(s) in a table
   *
   * @public
   * @async
   * @param {string} table Table / Record name
   */
  public async delete(table: string): Promise<void> {
    await this._connectionHandler.send<string>('delete', table);
  }
}
