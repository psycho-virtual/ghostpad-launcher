"use client";
import "./chunk-FEESO44D.js";
import "./chunk-U5MFFDUF.js";

// node_modules/@wagmi/core/dist/providers/jsonRpc.js
function jsonRpcProvider({
  rpc
}) {
  return function(chain) {
    const rpcConfig = rpc(chain);
    if (!rpcConfig || rpcConfig.http === "")
      return null;
    return {
      chain: {
        ...chain,
        rpcUrls: {
          ...chain.rpcUrls,
          default: { http: [rpcConfig.http] }
        }
      },
      rpcUrls: {
        http: [rpcConfig.http],
        webSocket: rpcConfig.webSocket ? [rpcConfig.webSocket] : void 0
      }
    };
  };
}
export {
  jsonRpcProvider
};
//# sourceMappingURL=wagmi_providers_jsonRpc.js.map
