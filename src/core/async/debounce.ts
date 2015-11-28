const debounce: Function = (callback: Function, delay: number, leadingCall: boolean, trailingRecall: boolean) => {
	const DELAY: number = delay || 250,
		  CALL_BEFORE_DELAY: boolean = leadingCall || true,
		  RECALLABLE: boolean = trailingRecall || true;

	let timeout: any,
		recall: boolean,
		delayedApply: Function;

	delayedApply = (...args): void => {
		if (!CALL_BEFORE_DELAY || recall) {
			callback.apply(this, args);
		}
		timeout = recall = null;
	}

	return (...args): void => {
		recall = timeout && CALL_BEFORE_DELAY && RECALLABLE;

		if (timeout) {
			window.clearTimeout(timeout);
		}
		else if (CALL_BEFORE_DELAY) {
			callback.apply(this, args);
		}

		timeout = window.setTimeout(<any>delayedApply, DELAY);
	}
}

export default debounce;