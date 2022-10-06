"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionProvider = void 0;
const WebSocket = require("ws");
class ConnectionProvider {
    constructor(options) {
        this.options = options;
        this._ws = new WebSocket(this.getEndpoint());
    }
    getEndpoint() {
        return `${this.options.ssl ? 'wss' : 'ws'}://${this.options.host}:${this.options.port}/rpc`;
    }
    get connection() {
        return this._ws;
    }
}
exports.ConnectionProvider = ConnectionProvider;
//# sourceMappingURL=connection-provider.js.map