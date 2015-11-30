export const compose: Function = (...functions): Function => {
	return noop()
}

export const noop: Function = (): Function => {
	return function() { }
}