"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Surreal = void 0;
const connection_handler_1 = require("./websocket/connection-handler");
const connection_provider_1 = require("./websocket/connection-provider");
class Surreal {
    constructor(options) {
        this.options = options;
        this._connectionHandler = new connection_handler_1.ConnectionHandler(new connection_provider_1.ConnectionProvider(options), options.logger && options.logger.log ? options.logger.factory : undefined);
    }
    async close() {
        return this._connectionHandler.close();
    }
    async signIn() {
        return await this._connectionHandler.send('signin', {
            NS: this.options.ns,
            DB: this.options.db,
            user: this.options.user,
            pass: this.options.pass,
        });
    }
    async use(ns, db) {
        await this._connectionHandler.send('use', [ns, db]);
    }
    async info() {
        await this._connectionHandler.send('info');
    }
    async live(table) {
        return await this._connectionHandler.send('live', table);
    }
    async kill(query) {
        await this._connectionHandler.send('kill', query);
    }
    async let(key, value) {
        await this._connectionHandler.send('let', [key, value]);
    }
    async query(query, vars) {
        return await this._connectionHandler.send('query', [query, vars]);
    }
    async select(table) {
        return await this._connectionHandler.send('select', table);
    }
    async create(table, data) {
        return await this._connectionHandler.send('create', [
            table,
            data,
        ]);
    }
    async update(table, data) {
        return await this._connectionHandler.send('update', [
            table,
            data,
        ]);
    }
    async change(table, data) {
        return await this._connectionHandler.send('change', [table, data]);
    }
    async modify(table, data) {
        return await this._connectionHandler.send('modify', [
            table,
            data,
        ]);
    }
    async delete(table) {
        await this._connectionHandler.send('delete', table);
    }
}
exports.Surreal = Surreal;
//# sourceMappingURL=surreal.js.map