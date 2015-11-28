interface templateElement extends Object {
	tagName: string,
	content: string | templateElement,
	attributes: Object
}

export const template: Function = (tmpl: templateElement): HTMLElement => {
	let element = document.createElement('');

	return element;
}

export const groupTemplate: Function = (elements: templateElement[]): DocumentFragment => {
	let fragment = document.createDocumentFragment();

	return fragment;
}