export const log: Function = (...messages): void => {
	return console.log.apply(console, messages);
}