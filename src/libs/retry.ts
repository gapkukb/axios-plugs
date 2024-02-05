import axios, { Axios, AxiosError, RetryOptions } from "axios";
import { functionalAdapter } from "../utils";

function defaultRetryShould(error: AxiosError) {
	if (axios.isAxiosError(error)) {
		return error.code === AxiosError.ECONNABORTED || error.response?.status! >= 500;
	}
	return false;
}

const defaultOption: RetryOptions = {
	retryLimit: 0,
	retryDelay: 3000,
	retryShould: defaultRetryShould,
};

export default function retryAdapter(instance: Axios, option: RetryOptions = {}) {
	const $option = Object.assign({}, defaultOption, option);

	const rawAdapter = functionalAdapter(instance.defaults.adapter);

	//@ts-ignore
	instance.defaults.adapter = async function (config) {
		let retry = config.retryLimit ?? $option.retryLimit;
		const retryShould = config.retryShould ?? $option.retryShould;
		const retryDelay = config.retryDelay ?? $option.retryDelay;

		do {
			try {
				return await rawAdapter(config);
			} catch (error: any) {
				if (retry && retry > 1 && retryShould!(error)) {
					await new Promise((resolve) => {
						setTimeout(resolve, retryDelay);
					});
				} else {
					return Promise.reject(error);
				}
			}
		} while (retry && --retry);
	};

	return instance;
}
