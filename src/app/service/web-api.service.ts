interface WebAPIParams {
	method: 'generate-token' | 'update-token' | 'delete-token' | 'tokens';
	body?: any;
	urlParams?: any;
	priority: 'high' | 'low';
	loadingMessage?: string;
	callback: Function;
}

interface RequestParams {
	type: 'POST' | 'GET' | 'PUT' | 'DELETE';
	body?: any;
	url?: string;
}

interface RespoonseMessage {
	code: Number;
	message?: String;
	data?: any;
}

interface CurrentlyExecuting {
	payload: WebAPIParams;
	request?: Subscription;
}

import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebAPIService {

	private baseUrl = 'http://localhost:3000/api/1.0';
	private highPriorityQueue: WebAPIParams[] = [];
	private lowPriorityQueue: WebAPIParams[] = [];
	private callback: Function = null;
	private currentlyExecuting: CurrentlyExecuting = null;

	constructor(private http: HttpClient) { }

	public execute(payload: WebAPIParams) {
		if (payload == null) {
			return;
		}

		this.callback = payload.callback;

		if (payload.priority === 'high') {
			this.highPriorityQueue.push(payload);
		} else {
			this.lowPriorityQueue.push(payload);
		}

		this.processNext();
	}

	public clear() {
		if (this.currentlyExecuting) {
			this.currentlyExecuting.request.unsubscribe();
			this.currentlyExecuting = null;
		}

		this.highPriorityQueue = [];
		this.lowPriorityQueue = [];
	}

	private processNext() {
		if (this.currentlyExecuting === null) {
			// No request is currently executing
		} else if (this.currentlyExecuting.payload.priority === 'high') { // High priority request is currently executing. Let it execute
			return;
			// tslint:disable-next-line:max-line-length
		} else if (this.currentlyExecuting.payload.priority === 'low' && this.highPriorityQueue.length > 0) { // Low priority request is currently executing, but there is a high priority request pending.
			this.currentlyExecuting.request.unsubscribe();
		} else if (this.currentlyExecuting.payload.priority === 'low') {
			return;
		}

		let payload: WebAPIParams;
		if (this.highPriorityQueue.length > 0) {   // Execute items in highPriorityQueue
			payload = this.highPriorityQueue[0];
		} else if (this.lowPriorityQueue.length > 0) {   // Execute items in lowPriorityQueue
			payload = this.lowPriorityQueue[0];
		} else {   // No Request Pending
			return;
		}

		this.currentlyExecuting = { payload: payload };
		this.buildRequest(payload);
	}

	private buildRequest(payload: WebAPIParams) {
		let reqParams: RequestParams = null;

		switch (payload.method) {
			case 'generate-token': {
				reqParams = {
					type: 'POST',
					body: payload.body,
					url: this.baseUrl + '/token' + this.processURLParameters(payload.urlParams)
				};
				break;
			}
			case 'tokens': {
				reqParams = {
					type: 'GET',
					url: this.baseUrl + '/token' + this.processURLParameters(payload.urlParams),
					body: payload.body
				};
				break;
			}
			case 'update-token': {
				reqParams = {
					type: 'PUT',
					body: payload.body,
					url: this.baseUrl + '/token' + this.processURLParameters(payload.urlParams)
				};
				break;
			}
			case 'delete-token': {
				reqParams = {
					type: 'DELETE',
					url: this.baseUrl + '/token' + this.processURLParameters(payload.urlParams),
					body: payload.body
				};
				break;
			}

			default:
				break;
		}

		if (reqParams) {
			this.triggerRequest(reqParams);
		}
	}

	private processURLParameters(payload: JSON): String {
		if (payload == null || JSON.stringify(payload).length === 2) {
			return '';
		}

		let stringified: String = '';
		for (const key in payload) {
			if (payload.hasOwnProperty(key)) {
				stringified += key + '/' + payload[key] + '/';
			}
		}

		return '/' + stringified;
	}

	private triggerRequest(reqParams: RequestParams) {
		const onComplete = (_response: RespoonseMessage) => {
			if (this.currentlyExecuting.request) {
				this.currentlyExecuting.request.unsubscribe();
			}
			this.callback(_response);

			// Remove item from appropriate queue
			if (this.currentlyExecuting.payload.priority === 'high') {
				this.highPriorityQueue.splice(0, 1);
			} else {
				this.lowPriorityQueue.splice(0, 1);
			}

			this.currentlyExecuting = null;
			this.processNext();
		};

		this.currentlyExecuting.request = this.http.request(reqParams.type, reqParams.url, {
			body: reqParams.body,
			responseType: 'json',
			observe: 'response'
		}).subscribe(
			(_response: any) => {
				onComplete(_response.body);
			},
			_error => {
				onComplete({
					code: -1,
					message: "Internet not connected"
				});
			}
		);
	}
}