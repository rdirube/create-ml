import { BrowserModule } from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';
import { AppComponent } from './app.component';
import {ExtendedModule, FlexModule} from '@angular/flex-layout';
import {createCustomElement} from '@angular/elements';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatStepperModule} from '@angular/material/stepper';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatTooltipModule} from '@angular/material/tooltip';
import { GameInfoFormComponent } from './components/game-info-form/game-info-form.component';
import {MatInputModule} from '@angular/material/input';
import {NgxUploaderModule} from 'ngx-uploader';
import {MatSelectModule} from '@angular/material/select';
import { SettingsFormComponent } from './components/settings-form/settings-form.component';
import { ExerciseFormComponent } from './components/exercise-form/exercise-form.component';
import { ShowableFormComponent } from './components/showable-form/showable-form.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { RecordAudioComponent } from './components/record-audio/record-audio.component';

@NgModule({
  declarations: [
    AppComponent,
    GameInfoFormComponent,
    SettingsFormComponent,
    ExerciseFormComponent,
    ShowableFormComponent,
    RecordAudioComponent
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
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatMenuModule,
    MatButtonModule,
    MatListModule,
    ExtendedModule,
    MatTooltipModule,
    MatInputModule,
    NgxUploaderModule,
    MatSelectModule,
    FormsModule,
    MatSlideToggleModule
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
