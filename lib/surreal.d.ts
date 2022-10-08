import { ClientOptions } from './interface/client-options.interface';
import { QueryResult } from './interface/query-result.interface';
export declare class Surreal {
    private readonly options;
    private _connectionHandler;
    constructor(options: ClientOptions);
    close(): Promise<void>;
    signIn(): Promise<string>;
    use(ns: string, db: string): Promise<void>;
    info(): Promise<void>;
    live(table: string): Promise<string>;
    kill(query: string): Promise<void>;
    let(key: string, value: string): Promise<void>;
    query<T>(query: string, vars: {
        [key: string]: any;
    }, raw?: boolean): Promise<T[] | QueryResult<T>[]>;
    select<T>(table: string): Promise<T[]>;
    create<T extends Record<string, unknown>>(table: string, data?: T): Promise<T>;
    update<T extends Record<string, unknown>>(table: string, data?: T): Promise<T>;
    change<T extends Record<string, unknown>, K = T>(table: string, data?: Partial<T> & K): Promise<(T & K) | (T & K)[]>;
    modify(table: string, data?: any): Promise<any>;
    delete(table: string): Promise<void>;
}
