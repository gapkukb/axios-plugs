import { Axios, AxiosError, AxiosRequestConfig, AxiosResponse, isAxiosError } from "axios";

declare module "axios" {
	export interface AxiosRequestConfig {
		blocked?: boolean;
	}
}

export function predicate(result: AxiosResponse | AxiosError) {
	return isAxiosError(result) && result.response?.status === 401;
}

export default function authenticate(
	instance: Axios,
	option: {
		/**
		 * axios.isAxiosError(result)
		 */
		predicate?: (result: AxiosResponse | AxiosError) => boolean;
		refresh(config: AxiosRequestConfig): Promise<any>;
		/** 是否需要进入重试队列，通常不需要鉴权的接口，无需进入重试队列 */
		blocked?: boolean;
	}
) {
	let isOnGoing = false;
	const requests: Function[] = [];
	const enable = {
		runWhen: (config: AxiosRequestConfig) => !!option.refresh && config.blocked === true,
	};

	const _predicate = option.predicate || predicate;

	function authenticateResponse(result: AxiosResponse | AxiosError) {
		if (_predicate(result)) {
			const config = result.config;

			if (isOnGoing) {
				return new Promise((resolve) => {
					requests.push(function () {
						const promise = instance.request(config!);
						resolve(promise);
					});
				});
			}
			isOnGoing = true;
			return option
				.refresh(config!)
				.then((_) => {
					while (requests.length) {
						requests.shift()!();
					}
				})
				.finally(() => {
					isOnGoing = false;
				});
		}

		if (isAxiosError(result)) return Promise.reject(result);
		return result as any;
	}

	instance.interceptors.request.use(
		function authenticateRequest(config) {
			if (isOnGoing) {
				return new Promise((resolve) => {
					requests.push(function () {
						resolve(config);
					});
				});
			}
			return config;
		},
		undefined,
		enable
	);

	instance.interceptors.response.use(authenticateResponse, authenticateResponse, enable);
}
