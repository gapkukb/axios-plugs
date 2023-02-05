import axios, { Axios, AxiosDefaults, AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { AxiosPlusRequestConfig } from "./interface";
import { noop } from "./lib/utils";

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

			function _action(payload?: Record<string | number, any>, configure: AxiosPlusRequestConfig = {}) {
				let AC = new AbortController();

				const final = axios.mergeConfig(config, {
					url,
					method,
					signal: AC.signal,
					...configure,
					[field]: {
						...config[field],
						...payload,
						...configure[field],
					},
					__abort__: AC.abort,
				}) as AxiosPlusRequestConfig;

				_action.abort = final.__abort as any;
				return _this.request(final as any).finally(() => {
					_action.abort = noop;
					AC = null as any;
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

const http = new AxiosPlus({ baseURL: "" }).inits("get", "post");

http.get("/123")();
