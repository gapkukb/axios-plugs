import AxiosPlus, { RequestConfig } from "../core";

export default function convert(axios: AxiosPlus) {
	axios.defaults.transformRequest.unshift(function open(this: RequestConfig, data) {
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
