"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = loadEnv;
function loadEnv(env) {
    return {
        GRAPHQL_PLAYGROUND: env.GRAPHQL_PLAYGROUND !== "false"
    };
}
//# sourceMappingURL=index.js.map