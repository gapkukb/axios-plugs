import "axios";
import { RetryOptions } from "./plugins/retry";
declare module "axios/*";
declare module "axios" {
	export interface AxiosRequestConfig extends RetryOptions {
		cancelable?: boolean;
		loading?: boolean;
		__id?: number;
		cache?: boolean;
		dataType?: "jsonp" | "script" | "json" | "form" | "formData";
		jsonpCallback?: string;
	}
}
