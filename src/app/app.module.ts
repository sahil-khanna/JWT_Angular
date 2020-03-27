import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module'
import { ClientsComponent } from './controller/clients/clients.component';
import { ClientDetailsComponent } from './controller/client-details/client-details.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiMethodComponent } from './controller/api-method/api-method.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientsComponent,
    ClientDetailsComponent,
    ApiMethodComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }