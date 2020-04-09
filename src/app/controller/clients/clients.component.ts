import { Component, OnInit } from '@angular/core';
import { WebAPIService } from 'src/app/service/web-api.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-clients',
	templateUrl: './clients.component.html',
	styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

	private clients: [any];

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
					$this.clients = _response.data;
					console.log($this.clients);
				} else {
					// alert(_response.message);
				}
			}
		});
	}

	add() {
		this.router.navigate(['client-details']);
	}

	edit(index: number) {
		this.router.navigate(['client-details'], { queryParams: {data: JSON.stringify(this.clients[index])} });
	}
}