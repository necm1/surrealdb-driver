"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionHandler = void 0;
const authentication_exception_1 = require("../exception/authentication.exception");
const unknown_exception_1 = require("../exception/unknown.exception");
class ConnectionHandler {
    constructor(provider, logger) {
        this.provider = provider;
        this.logger = logger;
        this._exceptions = [
            {
                code: -32000,
                exception: new authentication_exception_1.AuthenticationException(),
            },
        ];
        this._id = '0';
        this._isConnected = false;
        this._records = {};
        this._holdingQueue = {};
        this.assignEvents();
    }
    assignEvents() {
        this.provider.connection.addEventListener('open', () => this.onOpen());
        this.provider.connection.addEventListener('error', (e) => this.onError(e));
        this.provider.connection.addEventListener('close', (e) => this.onClose(e));
    }
    async generateID() {
        return new Promise((res) => res((this._id = ((Number(this._id) + 1) %
            Number.MAX_SAFE_INTEGER).toString())));
    }
    async sendPayload(record) {
        return new Promise((resolve) => {
            const payload = JSON.stringify(record);
            this.provider.connection.send(payload);
            if (this.logger && this.logger.log) {
                this.logger.log(payload);
            }
            this.provider.connection.onmessage = async (e) => {
                await this.handleMessage(e);
                resolve(this._records[Number(record.id)]);
            };
        });
    }
    async send(method, params) {
        const record = {
            id: await this.generateID(),
            method,
            params: params ? (Array.isArray(params) ? params : [params]) : [],
        };
        if (!this.provider.connection || !this._isConnected) {
            return new Promise((resolve) => (this._holdingQueue[Number(record.id)] = { record, resolve }));
        }
        return (await this.sendPayload(record));
    }
    async handleMessage(e) {
        const response = JSON.parse(e.data);
        if (this.logger && this.logger.log) {
            this.logger.log(e.data);
        }
        if ('error' in response) {
            const exception = this._exceptions.filter((e) => response.error.code === e.code);
            if (!exception || exception.length === 0) {
                throw new unknown_exception_1.UnknownException(response.error.code, response.error.message);
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
    async close() {
        return new Promise(() => {
            this.provider.connection.close();
        });
    }
    onError(e) {
        if (this.logger && this.logger.error) {
            this.logger.error(e);
        }
    }
    onClose(e) {
        if (this._pingInterval) {
            clearInterval(this._pingInterval);
        }
        if (this.logger && this.logger.log) {
            this.logger.log('Connection closed');
        }
    }
    onOpen() {
        this._isConnected = true;
        if (this.logger && this.logger.log) {
            this.logger.log(`Successfully connected`);
        }
        if (!this._pingInterval) {
            this._pingInterval = setInterval(async () => await this.send('ping'), 30000);
        }
        if (Object.keys(this._holdingQueue).length > 0) {
            Object.keys(this._holdingQueue).forEach(async (e) => {
                await this.sendPayload(this._holdingQueue[e].record);
                delete this._holdingQueue[e];
            });
        }
    }
}
exports.ConnectionHandler = ConnectionHandler;
//# sourceMappingURL=connection-handler.js.map