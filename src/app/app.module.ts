import { BrowserModule } from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import {FlexModule} from '@angular/flex-layout';
import {createCustomElement} from '@angular/elements';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
  // entryComponents: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    const myElement = createCustomElement(AppComponent, { injector });
    customElements.define('creator-ml', myElement);
  }
  // ngDoBootstrap(): void {}
}
