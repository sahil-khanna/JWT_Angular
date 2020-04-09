import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, NgModel, FormArray } from '@angular/forms';

@Component({
	selector: 'app-api-method',
	templateUrl: './api-method.component.html',
	styleUrls: ['./api-method.component.css']
})
export class ApiMethodComponent implements OnInit {

	private methodName = new FormControl();
	private get = new FormControl();
	private put = new FormControl();
	private post = new FormControl();
	private delete = new FormControl();
	
	public methodDetailsForm = new FormGroup({
		methodName: this.methodName,
		get: this.get,
		put: this.put,
		post: this.post,
		delete: this.delete
	});

	constructor() { }

	ngOnInit() {
		this.get.setValue(true);
	}

	fill(payload: any) {
		setTimeout(() => {
			console.log(payload);
			this.methodName.setValue(payload.name);

			payload.verbs.forEach(verb => {
				if (verb == 'GET') {
					this.get.setValue(true);
				}
				if (verb == 'POST') {
					this.post.setValue(true);
				}
				if (verb == 'DELETE') {
					this.delete.setValue(true);
				}
				if (verb == 'PUT') {
					this.put.setValue(true);
				}
			});
		});
		
	}

	payload() {
		let verbs = [];
		if (this.get.value) {
			verbs.push('GET');
		}
		if (this.put.value) {
			verbs.push('PUT');
		}
		if (this.post.value) {
			verbs.push('POST');
		}
		if (this.delete.value) {
			verbs.push('DELETE');
		}

		return {
			name: this.methodName.value,
			verbs: verbs
		}
	}

}
