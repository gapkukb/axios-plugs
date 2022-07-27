export function noop(...args: any[]): any { }

function imul(h1, h2) {
	return Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
}

export function getHash(str: string, seed = 0) {
	let h1 = 0xdeadbeef ^ seed,
		h2 = 0x41c6ce57 ^ seed;
	for (let i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 = imul(h1, h2)
	h2 = imul(h2, h1)
	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

type ApiPaths<Doc> = keyof Doc
type ApiReq<Doc, Path extends string> = CombineRequest<Doc> & PathVariable<Path>
type ApiRes<Doc, Path extends string> = CombineRequest<Doc>


const has = Object.prototype.hasOwnProperty
/** 用于将对象排序后再序列化，避免对象的无序化提醒 */
export function serialize(obj, prefix) {
	const pairs = []
	Object.keys(obj).sort().forEach(key => {
		if (!has.call(obj, key)) return

		const value = obj[key]
		const enkey = encodeURIComponent(key)
		let pair: any
		if (typeof value === 'object') {
			pair = queryStringify(value, prefix ? prefix + '[' + enkey + ']' : enkey)
		} else {
			pair = (prefix ? prefix + '[' + enkey + ']' : enkey) + '=' + encodeURIComponent(value)
		}
		pairs.push(pair)

	})
	return pairs.join('&')
}

export type Seperator = ":" | "{}" | "[]" | RegExp
export function seperator(sep: Seperator = ":") {
	let regexp: RegExp
	if (sep === ":") {
		regexp = new RegExp(`:([^:\\/]+)`, 'g')
	} else if (sep === "{}") {
		regexp = new RegExp(`{([^}]+)}`, 'g')
	} else if (sep === "[]") {
		regexp = new RegExp(`\\[([^\\]]+)\\]`, 'g')
	}
	return regexp || sep
}