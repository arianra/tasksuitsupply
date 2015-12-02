import {extend, forEachKey} from "./../primitives/collection";

export interface templateElement extends Object {
	tag: string,
	content?: string | string[] | templateElement | templateElement[],
	attributes?: Object
}

export const template: Function = (tmpl: templateElement): HTMLElement => {
	let element = document.createElement(tmpl.tag);
	
	if (tmpl.content) {
		let tmplContents = [].concat(tmpl.content);

		tmplContents.forEach((value, key, collection) => {
			//expect content to be either [a single/an array of] textNode(s) or templateElement(s)
			if (typeof value !== 'object') {
				//sometimes the content contains HTML and should be parsed as such
				return element.insertAdjacentHTML('beforeend', <string>value)
			}
			return element.appendChild(template(value));
		});
	}

	if (tmpl.attributes) {
		forEachKey(tmpl.attributes, (key) => {
			element.setAttribute(key, tmpl.attributes[key]);
		});
	}

	return element;
}

export const groupTemplate: Function = (...tmpls: templateElement[]): DocumentFragment => {
	let fragment = document.createDocumentFragment();

	tmpls.forEach((node) => {
		fragment.appendChild(template(node));
	});

	return fragment;
}