export function polling<T extends (...ars: any[]) => Promise<any>>(f: T, interval: number = 3000) {
	let timer = null as unknown as number;
	f = f.bind(f)
	function _polling(...args: Parameters<T>): ReturnType<T> {
		return (f(args) as unknown as () => Promise<any>).finally(() => {
			timer = setTimeout(f, interval);
		});
	}
	_polling.stop = function stop() {
		clearTimeout(timer);
	};
	return _polling;
}