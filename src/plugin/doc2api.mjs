import { each } from "./doc2interface"

export function doc2api(hm) {
    const keys = Object.keys(hm)
    const output = `import AxiosPlus from "axios-plus";\n`
    output += `import {Paths} from "./doc2interface";\n\n`
    output += `const ${keys.join(",")} = new AxiosPlus<Paths>().createMethods(${keys.map(i => `"${i}"`).join(",")});\n\n`;

    each(hm, (method, config) => {
        each(config, (uri, value) => {
            output += `/** `
            if (value.tags) {
                output += value.tags.join('-')
            }
            if (value.summary) {
                output += value.summary
            }
            output += `**/\n`
            output += `export const ${apiId(method,uri,value)} = ${method}("${uri}");\n`
        })
    })

    return output
}

const CURD = {
    get: "get",
    post: 'create',
    put: "update",
    delete: "delete",
}

const regexp = /\/\{[^\{]\}/g
const regexp2 = /[-_]+(.)/g

function apiId(method, uri, value) {
    const name = uri
        .replace(regexp, "")
        .split("/")
        .slice(-2)
        .map(i => {
            i = i.replace(regexp2, (_, matched) => {
                return matched.toUpperCase()
            })
            return i.charAt(0).toUpperCase() + i.slice(1)
        })
        .join("")

    const prefix = CURD[method] || ""
    return prefix + name
}