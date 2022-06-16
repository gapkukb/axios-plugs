import axios, { Axios, } from "axios";
//@ts-ignore
import { merge } from "axios/lib/utils";
import { noop } from "./plugins/utils";
let AxiosPlus = /** @class */ (() => {
    class AxiosPlus extends Axios {
        constructor(config = {}) {
            super(config);
            this.defaults = merge(axios.defaults, this.defaults);
        }
        register(plugin, ...pluginConfig) {
            plugin(this, ...pluginConfig);
        }
        createMethod(method) {
            const _this = this;
            const filed = ["put", "post", "patch"].includes(method) ? "data" : "params";
            return function $request(url, cfg = {}) {
                dispatch.abort = noop;
                function dispatch(payload, config = {}) {
                    const conf = {
                        url,
                        method,
                        [filed]: payload,
                    };
                    const mergedConfig = merge(cfg, conf, config);
                    if (mergedConfig.cancelable !== false) {
                        const source = AxiosPlus.CancelToken.source();
                        mergedConfig.cancelToken = source.token;
                        dispatch.abort = function abort() {
                            source.cancel(mergedConfig);
                        };
                    }
                    return _this.request(mergedConfig);
                }
                return dispatch;
            };
        }
        createMethods(...methods) {
            return methods.reduce((acc, method) => {
                acc[method] = this.createMethod(method);
                return acc;
            }, {});
        }
    }
    AxiosPlus.Cancel = axios.Cancel;
    AxiosPlus.CancelToken = axios.CancelToken;
    AxiosPlus.Axios = axios.Axios;
    AxiosPlus.VERSION = axios.VERSION;
    AxiosPlus.isCancel = axios.isCancel;
    AxiosPlus.all = axios.all;
    AxiosPlus.spread = axios.spread;
    AxiosPlus.isAxiosError = axios.isAxiosError;
    return AxiosPlus;
})();
export { AxiosPlus };
export default AxiosPlus;
