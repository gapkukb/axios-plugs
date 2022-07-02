import { AxiosPlus, filter, loading, setId, convert, adapter, retry, cancelRepeated, cancellation } from ".";

const axios = new AxiosPlus({
	timeout: 10,
	retryLimit: 3,
	loading: true,
});

axios.register(filter, { reqIndex: 4, resIndex: -1 });
axios.register(setId, { reqIndex: 3, resIndex: -1 });
axios.register(cancellation, { reqIndex: 2, resIndex: -1 });
axios.register(cancelRepeated, { reqIndex: 1, resIndex: 0 });
axios.register(retry, { reqIndex: 1, resIndex: 1 });
axios.register(loading, {
	open() {
		console.log("open");
	},
	close() {
		console.log("close");
	},
	reqIndex: 0,
	resIndex: 2,
});
axios.register(convert, { reqIndex: 0, resIndex: -1 });
axios.register(adapter, { reqIndex: -1, resIndex: -1 });

const { get, post, put, delete: del } = axios.createMethods("get", "post", "put", "delete");

const getBaidu = post("http://www.baidu.com", { dataType: "form" });
getBaidu();
// getBaidu();
