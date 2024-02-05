import { Axios, AxiosRequestTransformer } from "axios";

export default function convertDataType(axios: Axios) {
	(axios.defaults.transformRequest as AxiosRequestTransformer[]).unshift(function convert(data) {
		// 这里处理了formData、form、json三种数据类型的转换
		if (this.dataType === "formData") {
			this.headers["Content-Type"] = "multipart/form-data";
		}
		if (this.dataType === "form") {
			// return new URLSearchParams(data);
			this.headers["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
		}
		return data;
	});
}
