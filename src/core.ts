import axios, { Axios, AxiosDefaults, AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { AxiosPlusRequestConfig } from "./interface";
import { getId, noop } from "./lib/utils";

type Methods = Lowercase<Method>;

export default class AxiosPlus extends Axios {
	constructor(config?: AxiosPlusRequestConfig) {
		const _config = axios.mergeConfig(axios.defaults, config);
		super(_config);
	}

	init<M extends Methods>(method: M, cfg: Omit<AxiosPlusRequestConfig, "method"> = {}) {
		const _this = this;
		const field = ["get", "delete", "head", "options"].includes(method) ? "params" : "data";

		return function _facotry(url: string, config: Omit<AxiosPlusRequestConfig, "url"> = {}) {
			config = axios.mergeConfig(cfg, config);
			config[field] = {
				...cfg[field],
				...config[field],
			};
			_action.abort = noop;
			_action.__id__ = -1;

			function _action(payload?: Record<string | number, any>, configure: AxiosPlusRequestConfig = {}) {
				let AC: AbortController | null = null;
				const _payload = {
					...config[field],
					...payload,
					...configure[field],
				};

				const final: AxiosPlusRequestConfig = axios.mergeConfig(config, {
					url,
					method,
					...configure,
					[field]: _payload,
					__abort__: noop,
				}) as AxiosPlusRequestConfig;

				// 每次请求的唯一id，用于取消重复请求
				final.__id__ = getId(config);

				if (final.cancelable) {
					AC = new AbortController();
					final.signal = AC.signal;
					_action.abort = final.__abort__ = AC.abort;
				}
				return _this.request(final as any).finally(() => {
					_action.abort = final.__abort__ = AC = null as any;
				});
			}

			return _action;
		};
	}

	inits<M extends Methods[]>(...methods: M) {
		return methods.reduce((acc, method) => {
			acc[method as M[number]] = this.init(method);
			return acc;
		}, Object.create(null) as Record<M[number], ReturnType<typeof this.init>>);
	}

	extend(config?: AxiosPlusRequestConfig) {
		const _config = axios.mergeConfig(this.defaults, config);
		const newer = new AxiosPlus(_config);
		const _this = this;
		function copy(property: string) {
			(newer as any).interceptors[property].handlers = (_this as any).interceptors[property].handlers.slice();
		}
		copy("request");
		copy("response");

		return newer;
	}
}

const instance = new AxiosPlus({ baseURL: "" });
const http = instance.inits("get", "post");
