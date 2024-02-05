import axios, { Axios, Method, AxiosRequestConfig, AxiosRequestConfigLess } from "axios";
import { noop, getId } from "./utils";

export * from ".";

type Methods = Lowercase<Method>;

export default class AxiosPlus extends Axios {
	constructor(config?: AxiosRequestConfigLess) {
		const _config = axios.mergeConfig(axios.defaults, config);
		super(_config);
	}

	init<M extends Methods>(method: M, cfg: Omit<AxiosRequestConfigLess, "method"> = {}) {
		const _this = this;
		const field = ["get", "delete", "head", "options"].includes(method) ? "params" : "data";

		return function _facotry(url: string, config: Omit<AxiosRequestConfigLess, "url"> = {}) {
			config = axios.mergeConfig(cfg, config);
			config[field] = {
				...cfg[field],
				...config[field],
			};

			_action.abort = noop;
			_action.__id__ = -1;

			function _action(payload?: Record<string | number, any>, configure: AxiosRequestConfigLess = {}) {
				let controller: AbortController | null = null;
				const _payload = {
					...config[field],
					...payload,
					...configure[field],
				};

				const final = axios.mergeConfig(config, {
					url,
					method,
					...configure,
					[field]: _payload,
					__abort__: noop,
				}) as AxiosRequestConfig;

				// 每次请求的唯一id
				//@ts-ignore
				final.__id__ = getId(config);

				if (final.cancelable ?? true) {
					controller = new AbortController();
					final.signal = controller.signal;
					//@ts-ignore
					_action.abort = final.__abort__ = controller.abort.bind(controller);
				}
				return _this.request(final as any).finally(() => {
					//@ts-ignore
					_action.abort = final.__abort__ = controller = null as any;
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

	use<R>(plugin: (instance: this) => R): this;
	use<T, R>(plugin: (instance: this, options: T) => R, options: T): this;
	use<T, R>(plugin: (instance: this, options?: T) => R, options?: T): this {
		plugin(this, options);
		return this;
	}

	extend(config?: AxiosRequestConfigLess) {
		config = axios.mergeConfig(this.defaults, config);
		const newer = new AxiosPlus(config);
		newer.interceptors = this.interceptors;

		return newer;
	}
}
