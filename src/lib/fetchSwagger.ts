import http from "http";
import fs from "fs";
import path from "path";

const writeFileRecursive = function (path: string, buffer: string) {
    return new Promise((resolve, reject) => {
        let lastPath = path.substring(0, path.lastIndexOf("/"));
        fs.mkdir(lastPath, { recursive: true }, (err) => {
            if (err) return reject(err);
            fs.writeFile(path, buffer, function (err) {
                if (err) return reject(err);
                return resolve(null);
            });
        });
    })
}

const parser = (i: string) => i.charAt(0).toUpperCase() + i.slice(1)

export default function fetchSwagger(url: string, config: {
    dir: string,
    nameJoiner?: (s: string) => string
} = {
        nameJoiner: parser
    }) {
    return new Promise((resolve, reject) => {
        http.get(url, function (result) {
            let data = ""
            result.on("data", chunk => {
                data += chunk
            })
            result.on("end", () => {
                Promise.all(writeFileRecursive(path.join("index.ts"), covert(data)),
                    writeFileRecursive(path.join("api.d.ts"), "export type ApiDoc=" + data))
                    .then(resolve).catch(reject)

            })
        }).on("error", reject)
    })
}

function convert(data: string) {
    const json = JSON.parse(data)
    const info = json.info
    const paths = json.paths

    let s = ""
    let m = new Set<string>()

    for (const key in paths) {
        const name = key.replace(/\[[^\]]+\]|{[^}]+}/g).split(/[-_/]/g).map(parser).join("")
        for (const method in paths[key]) {
            m.add(method)
            const item = paths[key][method]
            s += `/** ${item.tags.join(" - ")} - ${item.summary} **/\n`
            s += `export const ${name.charAt(0).toLowerCase() + name.slice(1)} = ${method.toLowerCase()}("${key}");\n`
        }
    }

    const m2 = Array.from(m)
    s = `const { ${m2.join(", ")} } = axiosPlus.createMethods("${m2.join('", "')}");\n\n` + s;
    s = `const axiosPlus = new AxiosPlus();\n` + s;
    s = `import AxiosPlus from "axios-plus";\n` + s;
    s = `/** ${info.title} - ${info.description} ${info.version} **/\n` + s;
    s = `/** swagger ${json.swagger} **/\n` + s;
}