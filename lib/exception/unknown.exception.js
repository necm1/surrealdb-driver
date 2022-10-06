"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownException = void 0;
class UnknownException extends Error {
    constructor(code, message) {
        super(`Error code: ${code} with message "${message}"`);
        this.name = UnknownException.name;
    }
}
exports.UnknownException = UnknownException;
//# sourceMappingURL=unknown.exception.js.map