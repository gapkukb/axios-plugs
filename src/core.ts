import axios, {
	Axios,
	AxiosRequestConfig,
	AxiosInstance,
	Method,
	AxiosStatic,
	AxiosDefaults,
	AxiosRequestTransformer,
	AxiosResponseTransformer,
	AxiosInterceptorManager,
	AxiosResponse,
	AxiosRequestHeaders,
	AxiosResponseHeaders,
} from "axios";
//@ts-ignore
import { merge } from "axios/lib/utils";
import { noop } from "./lib/utils";

type TMethod = Lowercase<Method>;

export interface AxiosPlusRequestTransformer {
	(this: AxiosRequestConfig, data: any, headers?: AxiosRequestHeaders): any;
}
export interface AxiosPlusResponseTransformer {
	(this: AxiosRequestConfig, data: any, headers?: AxiosResponseHeaders): any;
}

export type PluginOptions = {
	reqIndex: number;
	resIndex: number;
};

export class AxiosPlus extends Axios {
	static Cancel = axios.Cancel;
	static CancelToken = axios.CancelToken;
	static Axios = axios.Axios;
	static readonly VERSION = axios.VERSION;
	static isCancel = axios.isCancel;
	static all = axios.all;
	static spread = axios.spread;
	static isAxiosError = axios.isAxiosError;

	declare defaults: Omit<AxiosDefaults<any>, "transformRequest" | "transformResponse"> & {
		transformRequest: AxiosPlusRequestTransformer[];
		transformResponse: AxiosPlusResponseTransformer[];
	};
	constructor(config = {}) {
		super(config);
		this.defaults = merge(axios.defaults, this.defaults);

		// 改写use方法，支持按下标插入
		Object.defineProperty(this.interceptors.request.constructor.prototype, "use", {
			value: function use(fulfilled: any, rejected: any, options: any) {
				if (options.index < 0) return;
				this.handlers.splice(options.index, 0, {
					fulfilled: fulfilled,
					rejected: rejected,
					synchronous: options ? options.synchronous : false,
					runWhen: options ? options.runWhen : null,
				});
				return options.index;
			},
		});

		this.interceptors.request.use(1 as any);
	}

	register<O extends object, T extends PluginOptions>(plugin: (axios: AxiosPlus, config: T & O) => any, pluginConfig: T & O) {
		plugin(this, pluginConfig);
	}

	createMethod(method: TMethod) {
		const _this = this;
		const filed = ["put", "post", "patch"].includes(method) ? "data" : "params";
		return function $request(url: string, cfg: AxiosRequestConfig = {}) {
			dispatch.abort = noop;
			function dispatch(payload?: any, config: AxiosRequestConfig = {}) {
				const conf: AxiosRequestConfig = {
					url,
					method,
					[filed]: payload,
				};
				const mergedConfig = merge(cfg, conf, config);
				if (mergedConfig.cancelable !== false) {
					const source = AxiosPlus.CancelToken.source();
					mergedConfig.cancelToken = source.token;
					dispatch.abort = function abort() {
						source.cancel(mergedConfig as any);
					};
				}
				return _this.request(mergedConfig);
			}

			return dispatch;
		};
	}

	createMethods<M extends TMethod>(...methods: M[]) {
		return methods.reduce((acc, method) => {
			acc[method] = this.createMethod(method);
			return acc;
		}, {} as Record<M, ReturnType<typeof this.createMethod>>);
	}
}

export default AxiosPlus;
