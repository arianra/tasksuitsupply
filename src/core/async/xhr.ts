import { extend, defaults } from "./../primitives/collection";
import { noop } from "./../utils/functional";

interface XHRConfig extends Object {
	url: string;
	data?: any;
	method?: string;
	headers?: any;
	async?: boolean;
	responseType?: string;
	timeout?: number;
}

export default class XHR {
	constructor(private xhrConfig: XHRConfig, paused: boolean = false) {
		this.XMLHttpRequest = new XMLHttpRequest();

		extend(xhrConfig, { async: true });
		defaults(xhrConfig, { method: 'GET' });

		if (!paused) this.init();
		return this;
	}

	private XMLHttpRequest: XMLHttpRequest;

	public init = (): XHR => {
		let xhr = this.XMLHttpRequest,
			cfg = this.xhrConfig;

		xhr.open(cfg.method, cfg.url, cfg.async);

		if (cfg.headers) {
			cfg.headers.forEach((header) => {
				xhr.setRequestHeader(header.header, header.value);
			});
		}

		['responseType', 'timeout'].forEach((value) => {
			if (cfg[value] && value in xhr) {
				xhr[value] = cfg[value];
			}
		});

		xhr.onreadystatechange = (event: ProgressEvent) => {
			this.onReadyStateChange(event);
		}
		xhr.onerror = this.onError;

		xhr.send(cfg.data);

		return this;
	};

	public onReadyStateChange = (event: ProgressEvent) => {
		let xhr = this.XMLHttpRequest,
			readyState = xhr.readyState;

		switch (readyState) {
			case xhr.DONE:
				if (xhr.status > 300 || xhr.status < 200) {
					this.onError(xhr.status);
				}
				else {
					this.onSuccess(xhr.response);
				}
			default: 
				//always call onProgress
				this.onProgress(readyState);
		}
	}

	private onSuccess = function(response: any) { };
	private onError = function(event: Event | number) { };
	private onProgress = function(state: number) { };

	public fail = (errorCallback) => {
		this.onError = errorCallback;

		return this;
	};
	public done = (successCallback) => {
		this.onSuccess = successCallback;

		return this;
	};
	public notify = (progressCallback) => {
		this.onProgress = progressCallback;

		return this;
	};
}

export class Get extends XHR {
	constructor(xhrConfig: XHRConfig, paused?:boolean) {
		extend(xhrConfig, { method: 'GET' });
		super(xhrConfig, paused);
	}
}

export class GetJSON extends Get {
	constructor(xhrConfig: XHRConfig, paused?:boolean) {
		extend(xhrConfig, {
			responseType: 'json',
			headers: [{ header: "Content-Type", value: "application/json" }]
		})
		super(xhrConfig, paused);
	}
}