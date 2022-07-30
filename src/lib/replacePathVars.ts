import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import AxiosPlus, { PluginOptions } from "../core";
import { noop, seperator as _seperator, Seperator } from "./utils";

export default function replacePathVars(
	axios: AxiosPlus,
	seperator: Seperator
) {
	const regexp = _seperator(seperator)
	axios.interceptors.request.use(
		function fillPathVarsRequest(config) {
			if (!regexp) return config
			config.url = config.url.replace(regexp, (_, name) => {
				let payload = typeof config.params[name] !== 'undefined' ? config.params : config.data
				let value = payload[name]
				delete payload[name]
				return value || name
			})
			return config;
		},undefined,{
			runWhen:config=>!config.__retried
		}
	);
}
