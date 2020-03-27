import { Component, OnInit } from '@angular/core';
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
	// private verbs = new FormArray();

	// private get = true;
	// private put = false;
	// private post = true;
	// private delete = true;

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

	// submitMethodDetails() {
	// 	if (this.methodDetailsForm.invalid) {
	// 		for (const key in this.methodDetailsForm.controls) {
	// 			if (this.methodDetailsForm.controls.hasOwnProperty(key)) {
	// 				this.methodDetailsForm.controls[key].markAsTouched();
	// 			}
	// 		}
	// 		return;
	// 	}
	// }

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
