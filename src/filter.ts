import AxiosPlus from "./core";
import { AxiosPlusRequestConfig } from "./interface";

function filterRequest(config: AxiosPlusRequestConfig) {
	return config;
}

export default function filter(instance: AxiosPlus, option: { enable: boolean }) {
	const rawAdapter = instance.defaults.adapter;

	return instance.interceptors.request.use(filterRequest as any);
}
