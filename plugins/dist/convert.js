"use strict";
exports.__esModule = true;
function convert(axios) {
    axios.defaults.transformRequest.unshift(function open(data) {
        if (this.__retried !== undefined)
            return data;
        console.log("convert");
        if (this.dataType === "formData") {
            return Object.keys(data).reduce(function (acc, key) {
                acc.append(key, data[key]);
                return acc;
            }, new FormData());
        }
        if (this.dataType === "form") {
            return new URLSearchParams(data);
        }
        return data;
    });
}
exports["default"] = convert;
