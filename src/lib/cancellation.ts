import { stringify } from "qs";
import AxiosPlus, { PluginOptions } from "../core";
import { getHash } from "./utils";

export default function cancellation(axios: AxiosPlus, option: PluginOptions) {
	axios.interceptors.request.use(
		function cancelInject(config) {
			console.log("cancelInject");
			(config.__abort as any).config = config;
			return config;
		},
		undefined,
		{
			runWhen(config) {
				return !!config.cancelable && config.__retried === undefined;
			},
			index: option.reqIndex,
		}
	);
}
