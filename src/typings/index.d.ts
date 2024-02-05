import axios, { AxiosInterceptorManager } from "axios";
import { RetryOptions } from "../src/lib/retry";
import type { noop } from "../src/lib/utils";

declare module "axios" {
	export interface AxiosStatic {
		mergeConfig: any;
	}

	export interface RetryOptions {
		retryLimit?: number;
		retryDelay?: number;
		retryShould?(error: AxiosError): boolean;
	}

	export interface AxiosRequestConfig
		extends RetryOptions,
			Partial<{
				cancelable: boolean;
				repeatable: boolean;
				loading: boolean;
				retryLimit: number;
				retryDelay: number;
				cache: boolean;
				dataType: "jsonp" | "script" | "json" | "form" | "formData";
				jsonpCallback: string;
				poillingInterval: number;
				poillingInterval: number;
				strictMode: boolean;
				blockedWhenunauthenticated: boolean;
				retryShould: (error: AxiosError) => boolean;
				retokenShould(err: AxiosError): boolean;
				extra: Record<string | number, any>;
			}> {
		readonly __id__: number;
		readonly __abort__: typeof noop;
	}
	export type AxiosRequestConfigLess = Omit<AxiosRequestConfig, "__id__" | "__abort__">;
}
