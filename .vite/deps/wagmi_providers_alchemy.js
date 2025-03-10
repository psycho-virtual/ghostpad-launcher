"use client";
import "./chunk-FEESO44D.js";
import "./chunk-U5MFFDUF.js";

// node_modules/@wagmi/core/dist/providers/alchemy.js
function alchemyProvider({
  apiKey
}) {
  return function(chain) {
    var _a, _b, _c;
    const baseHttpUrl = (_a = chain.rpcUrls.alchemy) == null ? void 0 : _a.http[0];
    const baseWsUrl = (_c = (_b = chain.rpcUrls.alchemy) == null ? void 0 : _b.webSocket) == null ? void 0 : _c[0];
    if (!baseHttpUrl)
      return null;
    return {
      chain: {
        ...chain,
        rpcUrls: {
          ...chain.rpcUrls,
          default: { http: [`${baseHttpUrl}/${apiKey}`] }
        }
      },
      rpcUrls: {
        http: [`${baseHttpUrl}/${apiKey}`],
        webSocket: [`${baseWsUrl}/${apiKey}`]
      }
    };
  };
}
export {
  alchemyProvider
};
//# sourceMappingURL=wagmi_providers_alchemy.js.map
