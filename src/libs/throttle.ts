import { Axios, AxiosRequestConfig, CanceledError } from "axios";
import { functionalAdapter } from "../utils";

/** 请求节流，重复请求时取消掉上次未完成的请求，只保留最新的请求 */
export default function throttle(
	instance: Axios,
	/**
	 * 请求优先级
	 * before: 保留旧的请求，取消新的请求
	 * after: 保留新的请求，取消旧的请求
	 * auto: 保留最先完成的请求，取消其他的请求
	 *
	 */
	priority: "before" | "after" | "race" = "after",
	// 是否产生真实请求，仅在priority=before时生效，默认false
	realable: boolean = false
) {
	const store: Record<number, Function | Function[]> = {};
	const adapter = functionalAdapter(instance.defaults.adapter);

	function doBefore(id: number, config: AxiosRequestConfig) {
		if (store[id]) {
			if (!realable) {
				// axios 的dts与实际代码对不上，这里将config 变体为any
				const cancelError = new CanceledError(undefined, config as any);
				//@ts-ignore
				cancelError.__throttle_before__ = true;
				return Promise.reject(cancelError);
			} else {
				setTimeout(() => {
					config.__abort__!(config);
				}, 0);
			}
		} else {
			store[id] = config.__abort__!;
		}
	}

	instance.defaults.adapter = function (config) {
		const id = config.__id__!;
		if (priority === "before") {
			doBefore(id, config);
		} else if (priority === "after") {
			(store[id] as Function)?.(config);
			store[id] = config.__abort__!;
		} else if (priority === "race") {
			store[id] ||= [];
			(store[id] as Function[]).push(config.__abort__!);
		}

		return adapter(config).finally(() => {
			if (priority === "race") {
				(store[id] as Function[]).forEach((fn) => fn(config));
			}
			delete store[id];
		});
	};
}
