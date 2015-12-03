import {interpolate} from "./../primitives/string";


export const Δ = document.querySelectorAll.bind(document);

export const traverseTextNode: Function = (element: HTMLElement, query: string): HTMLElement[] => {
	let nodes = [];

	[].forEach.call(element.querySelectorAll(query), (node) => {
		if (!node.childNodes.length) return;
		//don't do a deep traverse, it isn't needed for our purposes as of yet.
		nodes = nodes.concat([].filter.call(node.childNodes, (child) => {
			return (child.nodeName === '#text' || child instanceof Text);
		}));
	});
	return nodes;
}

export const assignDelimitedTextNode: Function = (element: HTMLElement, query: string, delimiter: RegExp, assign: any): HTMLElement => {
	traverseTextNode(element, query).filter((node) => {
		return delimiter.test(node.textContent);
	}).forEach((textNode) => {
		assign(textNode);
	});

	return element;
}

export const interpolateTextNode: Function = (element: HTMLElement, interpolateQuery: string, data: any) => {
	let query = `[data-interpolate${(!interpolateQuery) ? '' : `=${interpolateQuery}`}]`,
		delimiter = /\{\{([\s\S]+?)\}\}/m; // matches: {{  }}
		
	assignDelimitedTextNode(element, query, delimiter, (textNode) => {
		// we are containing all textnodes with interpolated values in a span,
		// it takes considerable less effort to replace textnodes this way
		let newNode = document.createElement('span');
		newNode.insertAdjacentHTML('beforeend', interpolate(textNode.textContent, data));
		textNode.parentNode.replaceChild(newNode, textNode);
	});

	return element;
}


//TODO: abstract replaceTextNode along with interpolateTextNode, due to duplicate code
export const replaceTextNode: Function = (element: HTMLElement, replaceQuery: string, replaceNode: HTMLElement|DocumentFragment) => {
	let query = `[data-replace${(!replaceQuery) ? '' : `=${replaceQuery}`}]`,
		delimiter = /\{\{([\s\S]+?)\}\}/m; // matches: {{  }}
		
	assignDelimitedTextNode(element, query, delimiter, (textNode) => {
		textNode.parentNode.replaceChild(replaceNode, textNode);
	});

	return element;
}

export const injectHTML: Function = (elementBase: HTMLElement, injectQuery: string, injectNode: string|HTMLElement|DocumentFragment) => {
	let query = `[data-inject${(!injectQuery) ? '' : `=${injectQuery}`}]`,
		elements = elementBase.querySelectorAll(query);
	
	if(injectNode instanceof DocumentFragment){
		//documentfragment should be copied, as it empties itself after injection
		//for now just add it to the first occurence
		return elements[0].appendChild(injectNode)
	}
	
	return [].slice.call(elements, (element)=>{ 
		element.insertAdjacentHTML('beforeend', injectNode)
	 });
}