import http from "http";
import fs from "fs";
import path from "path";
import doc2api from "./doc2api.mjs"

export default function fetch() {
    http.get(url, then => {
        let text = "";
        let definitionText = "";
        let apiText = "";

        then
            .on("data", chunk => {
                text += chunk
            })
            .on("end", () => {
                const data = JSON.parse(text);
                const paths = formatPath(data.paths);
                definitionText += parsePath(paths)
                definitionText += parse(paths)
                definitionText += parseDefinitions(data.definations)

                apiText = doc2api(paths)

                writeFile(path.join(process.cwd(), "apis/types.d.ts"), definitionText)
                writeFile(path.join(process.cwd(), "apis/api.ts"), apiText)
            })
    })
}

function writeFile(filepath, text) {
    return new Promise((resolve, reject) => {
        fs.mkdir(path.dirname(filepath), { recursive: true }, err => {
            if (err) return reject(err);
            fs.writeFile(filepath, text, err => {
                if (err) return reject(err);
                return resolve(null);
            })
        })
    })
}


function formatPath(paths) {
    const hm = {};
    each(paths, (uri, methods) => {
        each(methods, (method, config) => {
            hm[method] ||= {};
            hm[method][uri] ||= config
        })
    })
    return hm
}

function parsePath(hm) {
    let output = ""
    each(hm, (method, config) => {
        output += `${method}:{\n`;
        each(config, (uri, value) => {
            if (value.tags && value.summary) {
                output += `/** ${value.tags.join("-")} - ${value.summary} **/\n`
            }
            output += `"${uri}":{\n`;
            output += `Request:${parseParameters(value.parameters)};\n`
            output += `Response:Definitions["${value.response[200].schema.originalRef}"];\n`
            output += `};\n`
        })
    })
    return `export type Paths = {\n${output}\n};\n\n`
}

function parseParameters(params = {}) {
    let empty = true
    let ret = "{\n"

    each(params, (key, value) => {
        if (value.in !== "header") {
            empty = false
            if (value.description) {
                ret += `/** ${value.description} **/\n`
            }
            ret += `${value.name}${value.required === false ? "?" : ""}:${transfer[value.type]?.(value) || value.type};\n`;
        }
    })

    ret += "}\n";

    return empty ? "any" : ret
}

function parseProperties(props) {
    let ret = "{\n"

    each(props, (key, value) => {
        if (value.description) {
            ret += `/** ${value.description} **/\n`
        }
        const funcName = value.type || (value.originalRef ? "originalRef" : undefined)
        const text = `${key}:${transfer[funcName]?.(value) || value.type};\n`
        ret += text;
    })

    ret += "}\n";
}

function parseDefinitions(definitions) {
    let ret = "{\n"

    each(definitions, (key, value) => {
        if (value.description) {
            ret += `/** ${value.description} **/\n`
        }
        ret += `"${key}":${parseProperties(value.properties)};\n`
    })

    ret += "}\n";

    return `export type Definitions = ${ret}\n\n\n`
}

export function each(target, executor) {
    if (!target || typeof target !== "object" || typeof executor !== "function") return;
    return Object.entries(target).forEach(([key, value], index, origin) => {
        return executor(key, value, index, origin)
    })
}

function format(text) {
    let depth = 0;
    let arr = text.split(/[\n\r]/g);
    arr.forEach((t, index) => {
        if (t.includes("{")) {
            depth++
        } else if (t.includes("}")) {
            depth--
        } else {
            arr[index] = "\t".repeat(depth) + t
        }
    })

    return arr.join("\n").trim();
}

const transfer = {
    enum($enum) {
        return $enum.map(i => `"${i}"`).join("|")
    },
    originalRef(value) {
        return `Definitions["${value.originalRef}"]`;
    },
    object(value) {
        return "object"
    },
    string(value) {
        if (value.enum) return this.enum(value.enum);
    },
    integer(value) {
        return "number"
    },
    array(value) {
        const items = value.items
        let type = items.type
        if (items.originalRef) type = `Definitions["${items.originalRef}"]`;
        if (items.enum) type = `(${this.enum(items.enum)})`;
        return type + "[]"
    }
}