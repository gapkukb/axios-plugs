import { AxiosRequestConfig } from "axios";
import AxiosPlus from "./core";

export interface AxiosPlusRequestConfig extends AxiosRequestConfig {
	__abort__?: function;
	__id__?: number;
	cancelable?: boolean;
	strictMode?: boolean;
}
