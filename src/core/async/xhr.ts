interface xhrConfig {
	method: string,
	url: string,
	data: string|Object,
	headers: string[],
	responseType: string
}

export default class XHR {
	constructor(private config:xhrConfig){
		
	}	
}