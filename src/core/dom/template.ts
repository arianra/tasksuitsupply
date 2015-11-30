import {extend, forEachKey} from "./../primitives/collection";

interface templateElement extends Object {
	tag: string,
	content: string | templateElement,
	attributes: Object
}

export const template: Function = (tmpl: templateElement): HTMLElement => {
	let element = document.createElement(tmpl.tag);
	//expect content to be either [a single/an array of] textNode(s) or templateElement(s)
	if (tmpl.content) {
		let tmplContents = [].concat(tmpl.content);

		tmplContents.forEach((value, key, collection) => {
			let content;
			
			if (typeof value !== 'object') {
				content = document.createTextNode(<string>value);
			}
			else {
				content = template(value);
			}
			
			element.appendChild(content);
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