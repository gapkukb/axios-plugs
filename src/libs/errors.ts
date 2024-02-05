import { Axios, AxiosResponse } from "axios";

/** 用于将message转为id，防止重复提示消息
 * example:
 * const id = toIntId("message");
 * if( exsit(id) ) return;
 * alert(message)
 */
export { hashCode } from "../utils";

type ErrorHandler = (error: any) => string | boolean | undefined;

export default function errors(
	instance: Axios,
	option: {
		/**
		 * 如果是函数，返回值如下：
		 * string = 抛出错误信息
		 * true = 抛出默认信息+错误码
		 * false|undefined = 不抛出信息
		 */

		errors: Partial<Record<"timeout" | number | (string & {}), string | ErrorHandler>>;
		/**
		 * errors中未匹配到的错误信息会执行 fallback 函数
		 * 常用于处理业务错误
		 */
		fallback: ErrorHandler;
		/** 抛出错误信息的函数 */
		showMessage?: (message: string) => any;
		// 业务代码校验，过滤出正确的业务状态码
		// 仅当return true时，表示正确，进入then回调
		// 返回其他可用作errors的匹配key
		validate: (response: AxiosResponse) => boolean | string | number;
	}
) {
	function setMessage(code: keyof typeof option.errors, error: any) {
		let handler = option.errors[code] || option.fallback;
		let message = typeof handler === "function" ? handler(error) : handler;

		return message;
	}

	instance.interceptors.response.use(
		(response) => {
			const result = option.validate(response);
			if (result === true) {
				return response;
			}
			//@ts-ignore
			response.___statusCode__ = result;
			throw response;
		},
		(error) => {
			let msg: string | boolean | undefined;
			if (error.___statusCode__) {
				msg = setMessage(error.___statusCode__ as any, error);
			} else if (error.response) {
				// console.log("请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围");
				msg = setMessage(error.response.status as any, error);
			} else if (error.request) {
				//console.log("请求已经成功发起，但没有收到响应");
				msg = setMessage("timeout", error);
			} else {
				//console.log("发送请求时出了点问题");
				msg = setMessage(400, error);
			}

			// 非静默接口，抛出异常
			if (error.config.slient !== false) {
				if (typeof msg === "string") {
					error.realMessage = msg;
					option.showMessage?.(msg);
				} else {
					const _message = error.message + (error.response?.status ?? error.code);
					error.realMessage = _message;

					if (msg === true) {
						option.showMessage?.(_message);
					}
				}
			}

			return Promise.reject(error);
		}
	);
}
