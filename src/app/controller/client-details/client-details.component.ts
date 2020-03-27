import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, NgModel } from '@angular/forms';
import { WebAPIService } from '../../service/web-api.service';
import { Location } from '@angular/common';
import { Method } from 'src/app/models/method';
import { ApiMethodComponent } from '../api-method/api-method.component';

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

	private minDate: Date;
	private maxDate: Date;

	private methods = new Array();

	public clientDetailsForm = new FormGroup({
		clientCompany: this.clientCompany,
		clientEmail: this.clientEmail,
		providerEmail: this.providerEmail,
		description: this.description,
		expiresOn: this.expiresOn
	});

	constructor(
		private webAPI: WebAPIService,
		// private alertHelper: AlertHelper,
		// private categoriesService: CategoriesService,
		// private languagesService: LanguagesService,
		// private booksService: BooksService,
		// private loadingIndicator: LoadingIndicatorService,
		private location: Location
	) {
		this.minDate = new Date();
		this.maxDate = new Date(this.minDate.getFullYear() + 1, this.minDate.getMonth(), this.minDate.getDay());
	}

	ngOnInit() {
		this.addMethod();
		setTimeout(() => {
			// this.loadingIndicator.show();

			// this.categoriesService.getAll()
			// .then((res) => {
			// 	this.categories = res as [];
			// })
			// .finally(() => {
			// 	this.languagesService.getAll()
			// 	.then((res) => {
			// 		this.languages = res as [];
			// 	})
			// 	.finally(() => {
			// 		this.loadingIndicator.hide();
			// 	});
			// });
		});
	}

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

		let methods = [];
		apiMethods.forEach(apiMethodComponent => {
			methods.push(apiMethodComponent.payload());
		});

		let payload = {
			issuer: {
				clientCompany: this.clientCompany.value,
				clientEmail: this.clientEmail.value,
				providerEmail: this.providerEmail.value
			},
			authorizedMethods: methods,
			expiresOn: this.expiresOn.value.toISOString().split('T')[0]
		}

		console.log(JSON.stringify(payload));

		// this.loadingIndicator.show();
		debugger;
		this.webAPI.execute({
		  method: "generate-token",
		  priority: "high",
		  body: payload,
		  callback: (response) => {
			  debugger;
		    console.log(response)
		  }
		})

		// this.methods.push();
	}

	deleteClientDetails() {
		
	}

	submit() {
		// this.loadingIndicator.show();
		// this.webAPI.execute({
		//   method: 'update-token',
		//   priority: 'high',
		//   callback: (response) => {
		//     console.log(response)
		//   }
		// })

		// this.methods.push();
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
}