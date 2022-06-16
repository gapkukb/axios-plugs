import Axios from "./core";
import filter from "./plugins/filter";
import loading from "./plugins/loading";
import setId from "./plugins/setId";
import retry from "./plugins/retry";
const axios = new Axios({
    timeout: 10,
    retryLimit: 2,
    loading: true,
});
axios.register(filter);
axios.register(setId);
// axios.register(convert);
axios.register(loading, {
    open() {
        console.log("open");
    },
    close() {
        console.log("close");
    },
});
// axios.register(adapter);
axios.register(retry);
const { get, post, put, delete: del } = axios.createMethods("get", "post", "put", "delete");
const getBaidu = post("http://www.baidu.com", { dataType: "form" });
getBaidu({
    a: 1,
}, {
    params: {
        c: 3,
    },
    data: {
        b: 2,
    },
}).catch((e) => {
    console.log("failed");
});
