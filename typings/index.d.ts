import axios from "axios";
import { RetryOptions } from "../src/lib/retry";
import { noop } from "../src/lib/utils";
declare module "axios/*";
declare module "axios" {
	export interface AxiosRequestConfig extends RetryOptions {
		cancelable?: boolean;
		repeatable?: boolean;
		loading?: boolean;
		__id?: number;
		__abort: typeof noop;
		cache?: boolean;
		dataType?: "jsonp" | "script" | "json" | "form" | "formData";
		jsonpCallback?: string;
	}
}
