import axios, {
	Axios,
	AxiosRequestConfig,
	AxiosInstance,
	Method,
	AxiosStatic,
	AxiosDefaults,
	AxiosRequestTransformer,
	AxiosResponseTransformer,
} from "axios";
//@ts-ignore
import { merge } from "axios/lib/utils";
import { noop } from "./plugins/utils";

type TMethod = Lowercase<Method>;

export interface RequestConfig extends AxiosRequestConfig {
	cancelable?: boolean;
	ignore?: boolean;
	loading?: boolean;
	__id?: string;
	__MD5?: string;
	cache?: boolean;
	dataType?: "jsonp" | "script" | "json" | "form" | "formData";
	jsonpCallback?: string;
	allowRepeat?: boolean;
	abortable?: boolean;
}

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
		transformRequest: AxiosRequestTransformer[];
		transformResponse: AxiosResponseTransformer[];
	};
	constructor(config: RequestConfig = {} as any) {
		super(config);
		this.defaults = axios.defaults as any;
	}

	register<T extends any[] = any[]>(plugin: (axios: AxiosPlus, ...config: T) => any, ...pluginConfig: T) {
		plugin(this, ...pluginConfig);
	}

	private createMethod(method: TMethod) {
		const _this = this;
		const filed = ["put", "post", "patch"].includes(method) ? "data" : "params";
		return function $request(url: string, cfg: RequestConfig = {}) {
			dispatch.abort = noop;

			function dispatch(payload?: any, config: RequestConfig = {}) {
				const conf: RequestConfig = {
					url,
					method,
					[filed]: payload,
				};
				const mergedConfig = merge(cfg, conf, config);
				if (mergedConfig.abortable) {
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