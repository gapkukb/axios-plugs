type Option = { interval?: number; times?: number; autoStart?: boolean; scope?: any };

export default class Polling<T extends Array<any>> {
	private timer: any = 0;
	private resolves: any = [];
	private rejects: any = [];
	private finallies: any = [];
	private completes: any = [];
	private option: Option = {
		interval: 3000,
		autoStart: true,
		scope: null,
	};

	times = Number.MAX_SAFE_INTEGER;

	constructor(private callee: (...args: T) => any, option?: Option) {
		Object.assign(this.option, option);
		this.times = option?.times ?? this.times;
	}

	start(...args: T) {
		this.stop();
		this.excutor(this.callee, ...args).finally(() => {
			if (--this.option.times! > 0) {
				this.timer = setTimeout(() => {
					this.start(...args);
				}, this.option.interval);
			} else {
				for (let i = 0, len = this.completes.length; i < len; i++) {
					this.completes[i]();
				}
			}
		});
		return this;
	}
	private async excutor(fn: (...args: any) => any, ...args: any) {
		try {
			let data = await Promise.resolve(fn.apply(this.option.scope, args));
			for (let i = 0, len = this.resolves.length; i < len; i++) {
				data = this.resolves[i](data);
			}
		} catch (error) {
			for (let i = 0, len = this.rejects.length; i < len; i++) {
				error = this.resolves[i](error);
			}
		} finally {
			for (let i = 0, len = this.finallies.length; i < len; i++) {
				this.finallies[i]();
			}
		}
	}

	then(onFulfilled: (data: any) => any, onRejected?: (reason: any) => any) {
		this.resolves.push(onFulfilled);
		onRejected && this.rejects.push(onRejected);
		return this;
	}

	catch(onRejected: (reason: any) => any) {
		this.rejects.push(onRejected);
		return this;
	}

	finally(cb: VoidFunction) {
		this.finallies.push(cb);
		return this;
	}

	complete(cb: VoidFunction) {
		this.completes.push(cb);
		return this;
	}

	stop() {
		clearTimeout(this.timer);
		return this;
	}
}

// const test = {
// 	demo() {
// 		return this;
// 	},
// };

// const polling = new Polling(test.demo, { scope: test });

// polling
// 	.then((data) => {
// 		console.log(data);
// 	})
// 	.start();
