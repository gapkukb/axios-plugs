// import { AxiosPlus, filter, loading, setId, convert, adapter, retry, cancelRepeated, cancellation } from ".";

import AxiosPlus from "./core";

// const axios = new AxiosPlus({
// 	timeout: 10,
// 	retryLimit: 3,
// 	loading: true,
// });

// axios.register(filter, { reqIndex: 4, resIndex: -1 });
// axios.register(setId, { reqIndex: 3, resIndex: -1 });
// axios.register(cancellation, { reqIndex: 2, resIndex: -1 });
// axios.register(cancelRepeated, { reqIndex: 1, resIndex: 0 });
// axios.register(retry, { reqIndex: 1, resIndex: 1 });
// axios.register(loading, {
// 	open() {
// 		console.log("open");
// 	},
// 	close() {
// 		console.log("close");
// 	},
// 	reqIndex: 0,
// 	resIndex: 2,
// });
// axios.register(convert, { reqIndex: 0, resIndex: -1 });
// axios.register(adapter, { reqIndex: -1, resIndex: -1 });

// const { get, post, put, delete: del } = axios.createMethods("get", "post", "put", "delete");

// const getBaidu = post<{ a: string }, { b: string }>("http://www.baidu.com", { dataType: "form" });
// const getBaidu2 = AxiosPlus.polling(post<{ a: string }, { b: string }>("http://www.baidu.com/", { dataType: "form" }));

// getBaidu2({
// 	a: "1",
// }).then((res) => {
// 	res;
// });
// getBaidu().then((res) => {});
// getBaidu2.stop();

const demo = new AxiosPlus({ baseURL: "http://baidu.com" }).init("get")("/123");

demo({}).catch((e) => {
	// console.log(e.config);
});

demo.abort();
const http = new AxiosPlus({ baseURL: "http://baidu.com" });
http.interceptors.request.use(function (config) {
	console.log("``````````````");
	// console.log(config);
	console.log("``````````````");
	return config;
});
http.get("/213");
