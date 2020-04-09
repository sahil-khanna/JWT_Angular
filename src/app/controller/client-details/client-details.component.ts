import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, NgModel } from '@angular/forms';
import { WebAPIService } from '../../service/web-api.service';
import { Location } from '@angular/common';
import { Method } from 'src/app/models/method';
import { ApiMethodComponent } from '../api-method/api-method.component';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export const DATE_FORMATS = {
	parse: {
		dateInput: 'M/DD/YYYY',
	},
	display: {
		dateInput: 'MM/DD/YYYY'
	},
};

@Component({
	selector: 'app-client-details',
	templateUrl: './client-details.component.html',
	styleUrls: ['./client-details.component.css']
})

export class ClientDetailsComponent implements OnInit {

	@ViewChildren(ApiMethodComponent) apiMethodComponents: ApiMethodComponent;

	private clientCompany = new FormControl();
	private clientEmail = new FormControl();
	private providerEmail = new FormControl();
	private description = new FormControl();
	private expiresOn = new FormControl();
	private token = new FormControl();

	private existingClient: any;

	private expiryDate: any;

	private minDate: Date;
	private maxDate: Date;

	private methods = new Array();

	public clientDetailsForm = new FormGroup({
		clientCompany: this.clientCompany,
		clientEmail: this.clientEmail,
		providerEmail: this.providerEmail,
		description: this.description,
		expiresOn: this.expiresOn,
		token: this.token
	});

	constructor(
		private webAPI: WebAPIService,
		private snackBar: MatSnackBar,
		// private alertHelper: AlertHelper,
		// private loadingIndicator: LoadingIndicatorService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private location: Location
	) {
		this.minDate = new Date();
		this.maxDate = new Date(this.minDate.getFullYear() + 1, this.minDate.getMonth(), this.minDate.getDay());

		// Read the data from query string
		this.activatedRoute.queryParams.subscribe(params => {
			if (params.data) {
				this.existingClient = JSON.parse(params.data);
				this.existingClient.data.authorizedMethods.forEach(authorizedMethod => {
					this.methods.push(this.methods.length);
				});
			}
		});
	}

	ngOnInit() {
		// Populate data if there was a querystring
		if (!this.existingClient) {
			return;
		}
		
		this.clientCompany.setValue(this.existingClient.data.issuer.clientCompany);
		this.clientEmail.setValue(this.existingClient.data.issuer.clientEmail);
		this.providerEmail.setValue(this.existingClient.data.issuer.providerEmail);
		this.description.setValue(this.existingClient.data.issuer.description);
		this.expiresOn.setValue(moment(this.existingClient.data.expiresOn, 'x').toDate());
		this.token.setValue(this.existingClient.token);

		this.clientCompany.disable({ onlySelf: true });
		this.clientEmail.disable({ onlySelf: true });
		this.providerEmail.disable({ onlySelf: true });
		this.token.disable({ onlySelf: true });
	}

	ngAfterViewInit() {
		// Populate methods if there was a querystring
		if (!this.existingClient) {
			return;
		}

		for (let index = 0; index < this.existingClient.data.authorizedMethods.length; index++) {
			let authorizedMethod = this.existingClient.data.authorizedMethods[index];
			let apiMethod = this.apiMethodComponents["_results"][index];
			apiMethod.fill(authorizedMethod);
		}
	}

	// Button Action
	submitClientDetails() {
		if (this.clientDetailsForm.invalid) {
			for (const key in this.clientDetailsForm.controls) {
				if (this.clientDetailsForm.controls.hasOwnProperty(key)) {
					this.clientDetailsForm.controls[key].markAsTouched();
				}
			}
			return;
		}

		let apiMethods = this.apiMethodComponents["_results"];
		apiMethods.forEach(apiMethodComponent => {
			if (apiMethodComponent.methodDetailsForm.invalid) {
				for (const key in apiMethodComponent.methodDetailsForm.controls) {
					if (apiMethodComponent.methodDetailsForm.controls.hasOwnProperty(key)) {
						apiMethodComponent.methodDetailsForm.controls[key].markAsTouched();
					}
				}
				return;
			}
		});

		if (this.existingClient) {
			this.updateClientDetails();
		}
		else {
			this.addClientDetails();
		}
	}

	deleteClient() {
		let payload = {
			token: this.existingClient.token
		};
		this.webAPI.execute({
			method: "delete-token",
			priority: "high",
			body: payload,
			callback: (response) => {
				this.showSnackBar(response.message);
				if (response.code == 0) {
					this.location.back();
				}
			}
		});
	}

	blockClient(status: boolean) {
		var payload = this.clientDetailsPayload()
		payload['status'] = status;

		this.webAPI.execute({
			method: "update-token",
			priority: "high",
			body: payload,
			callback: (response) => {
				this.showSnackBar(response.message);
				if (response.code == 0) {
					this.location.back();
				}
			}
		});
	}

	deleteMethod(index: number) {
		if (this.methods.length == 1) {
			return;
		}

		this.methods.splice(index, 1);
	}

	addMethod() {
		this.methods.push(this.methods.length);
	}

	// Other Methods
	private clientDetailsPayload() {
		let apiMethods = this.apiMethodComponents["_results"];

		let methods = [];
		apiMethods.forEach(apiMethodComponent => {
			methods.push(apiMethodComponent.payload());
		});

		var payload = {
			issuer: {
				clientCompany: this.clientCompany.value,
				clientEmail: this.clientEmail.value,
				providerEmail: this.providerEmail.value,
				description: this.description.value
			},
			authorizedMethods: methods,
			status: true,
			expiresOn: moment(this.expiresOn.value.toISOString(), 'YYYY-MM-DDThh:mm:ss.Z').format('x')
		}

		if (this.existingClient) {
			payload['token'] = this.existingClient.token;
		}

		return payload;
	}

	private addClientDetails() {
		let payload = this.clientDetailsPayload()
		this.webAPI.execute({
			method: 'generate-token',
			priority: "high",
			body: payload,
			callback: (response) => {
				this.showSnackBar(response.message);
				if (response.code == 0) {
					this.location.back();
				}
			}
		})
	}

	private updateClientDetails() {
		var payload = this.clientDetailsPayload()
		payload['token'] = this.existingClient.token;

		this.webAPI.execute({
			method: 'update-token',
			priority: "high",
			body: payload,
			callback: (response) => {
				this.showSnackBar(response.message);
				if (response.code == 0) {
					this.location.back();
				}
			}
		})
	}

	private showSnackBar(message: string) {
		this.snackBar.open(message, '', {
			duration: 3000
		});
	}
}