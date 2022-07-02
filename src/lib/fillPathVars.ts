import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import AxiosPlus, { PluginOptions } from "../core";
import { noop } from "./utils";

export default function polling(
	axios: AxiosPlus,
	option: PluginOptions<{
		prefix: string,
		suffix: string
	}>
) {
	const regexp = new RegExp(`\\${option.prefix}([^${option.prefix}])+\\${option.suffix}`, 'g')
	axios.interceptors.request.use(
		function fillPathVarsRequest(config) {
			console.log("fillpathvars");
			config.url = config.url.replace(regexp, (_, name) => {
				let payload = config.params[name] ? config.params : config.data
				let value = payload[name]
				delete payload[name]
				return value
			})
			return config;
		}
	);
}
