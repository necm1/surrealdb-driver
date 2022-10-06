"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotConnectedException = void 0;
class NotConnectedException extends Error {
    constructor() {
        super('Connection is not established.');
        this.name = NotConnectedException.name;
    }
}
exports.NotConnectedException = NotConnectedException;
//# sourceMappingURL=not-connected.exception.js.map