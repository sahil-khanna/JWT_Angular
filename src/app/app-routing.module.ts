import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientsComponent } from './controller/clients/clients.component';
import { ClientDetailsComponent } from './controller/client-details/client-details.component';

const routes: Routes = [
  { path: '', component: ClientsComponent },
	{ path: 'clients', component: ClientsComponent },
	{ path: 'client-details', component: ClientDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
