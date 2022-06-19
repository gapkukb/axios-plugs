import { AxiosRequestConfig } from "axios";
import AxiosPlus, { PluginOptions } from "../core";

export default function convert(axios: AxiosPlus, option: PluginOptions) {
	axios.defaults.transformRequest.splice(option.reqIndex, 0, function open(data) {
		if (this.__retried !== undefined) return data;
		console.log("convert");
		if (this.dataType === "formData") {
			return Object.keys(data).reduce((acc, key) => {
				acc.append(key, data[key]);
				return acc;
			}, new FormData());
		}
		if (this.dataType === "form") {
			return new URLSearchParams(data);
		}
		return data;
	});
}
