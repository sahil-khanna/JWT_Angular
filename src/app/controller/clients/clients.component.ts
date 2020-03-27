import { Component, OnInit } from '@angular/core';
import { WebAPIService } from 'src/app/service/web-api.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-clients',
	templateUrl: './clients.component.html',
	styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

	private clients;

	constructor(private webAPI: WebAPIService, private router: Router) { }

	ngOnInit() {
		this.getClients();
	}

	private getClients() {
		const $this = this;
		this.webAPI.execute({
			method: "tokens",
			priority: 'high',
			callback: function (_response: any) {
				if (_response.code === 0) {
					this.tokens = _response.data;
				} else {
					// alert(_response.message);
				}
			}
		});
	}

	private add() {
		this.router.navigate(['client-details']);
	}
}