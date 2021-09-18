import { AxiosRequestConfig, ResponseType } from "axios";
import { RetryOptions } from "./plugins/retry";
type _ResponseType = ResponseType;
declare module "axios" {
	export interface NewOptions {
		cancelable?: boolean;
		ignore?: boolean;
		loading?: number;
		__MD5?: string;
		cache?: boolean;
		dataType: "jsonp" | "script" | "array" | "object";
		jsonpCallback: string;
		allowRepeat?: boolean;
	}

	export interface AxiosRequestConfig extends Partial<RetryOptions>, NewOptions {
		abort?(): void;
	}

	export type ResponseType = "jsonp";
}
