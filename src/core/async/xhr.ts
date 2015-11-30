import { extend } from "./../primitives/collection";
import { noop } from "./../utils/functional";

interface XHRConfig {
	method: string;
	url: string;
	data: any;
	headers?: any;
	async?: boolean;
	responseType?: string;
	timeout?: number;
}

export default class XHR {
	constructor(private xhrConfig:XHRConfig, paused:boolean = false){
		this.XMLHttpRequest = new XMLHttpRequest();
		
		extend( xhrConfig, {async:true});
		
		if(!paused) this.init();
		
		return this;
	}
	
	private XMLHttpRequest:XMLHttpRequest;
	
	public init = ():XHR => {
		let xhr = this.XMLHttpRequest,
			cfg = this.xhrConfig;
		
		if(cfg.headers){
			cfg.headers.forEach((header)=>{
				xhr.setRequestHeader( header.header, header.value );
			});
		}
		
		['responseType', 'timeout'].forEach( (value) => {
			if(cfg[value] && value in xhr){
				xhr[value] = cfg[value];
			} 
		});
		
		xhr.onreadystatechange = this.onReadyStateChange;
		xhr.onerror = this.onError;
		
		xhr.open( cfg.method, cfg.url, cfg.async );
		xhr.send(cfg.data);
		
		return this;
	};
	
	private onReadyStateChange = (event:ProgressEvent) => {
		let xhr = this.XMLHttpRequest,
			readyState = xhr.readyState;
		
		switch(readyState){
			case xhr.DONE:
				if( xhr.status > 300 || xhr.status < 200 ){
					this.onError( xhr.status );
				}
				else {
					this.onSuccess(xhr.responseText);
				}				
			default: 
				//always call onProgress
				this.onProgress(readyState);
		}
	}
	
	public fail = (errorCallback) => {
		this.onError = errorCallback;
	};
	public done  = (successCallback) => {
		this.onSuccess = successCallback;
	};
	public notify  = (progressCallback) => {
		this.onProgress = progressCallback;
	};
	
	private onSuccess = noop();
	private onError = noop();
	private onProgress = noop();
}

//"Content-Type", "application/json"

//export get
//export getJSON