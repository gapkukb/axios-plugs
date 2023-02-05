import { AxiosRequestConfig } from "axios";

export interface AxiosPlusRequestConfig extends AxiosRequestConfig {
	__abort__?: function;
}
