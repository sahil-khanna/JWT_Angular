import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatIconModule, MatListModule, MatProgressSpinnerModule, MatInputModule } from '@angular/material';
import { MatFormFieldModule, MatCheckboxModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
	imports: [
		BrowserAnimationsModule
	],
	exports: [
		MatIconModule,
		MatToolbarModule,
		MatListModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		MatFormFieldModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatSnackBarModule
	]
})

export class MaterialModule {

}