import { AxiosPlus, filter, loading, setId, convert, adapter, retry, cancelRepeated, cancellation } from ".";
import { abortAll } from "./core";

const axios = new AxiosPlus({
	// timeout: 10,
	retryLimit: 3,
	loading: true,
});

axios.register(cancellation, { reqIndex: 1, resIndex: -1 });
axios.register(cancelRepeated, { reqIndex: 0, resIndex: 1 });
// axios.register(loading, {
// 	open() {
// 		console.log("open");
// 	},
// 	close() {
// 		console.log("close");
// 	},
// 	reqIndex: 1,
// 	resIndex: 1,
// });
// axios.register(retry, { reqIndex: 2, resIndex: 0 });
// axios.register(setId, { reqIndex: 3, resIndex: -1 });
// axios.register(filter, { reqIndex: 4, resIndex: -1 });
// axios.register(convert, { reqIndex: 0, resIndex: -1 });
// axios.register(adapter, { reqIndex: -1, resIndex: -1 });

const { get, post, put, delete: del } = axios.createMethods("get", "post", "put", "delete");

const getBaidu = post("http://www.baidu.com", { dataType: "form" });
getBaidu();
getBaidu();
