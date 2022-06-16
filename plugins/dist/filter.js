"use strict";
exports.__esModule = true;
function $filter(value) {
    return !value && value !== 0 && value !== false;
}
function forEach(entries, f) {
    if (!entries || typeof entries !== "object")
        return entries;
    Object.keys(entries).forEach(function (key) {
        if (f(entries[key])) {
            delete entries[key];
        }
    });
    return entries;
}
function filter(axios, filter) {
    if (filter === void 0) { filter = $filter; }
    axios.interceptors.request.use(function (config) {
        console.log("filter");
        config.params = forEach(config.params, filter);
        config.data = forEach(config.data, filter);
        return config;
    }, undefined, {
        runWhen: function (config) {
            return config.__retried === undefined;
        }
    });
}
exports["default"] = filter;
