import {
  ChangeDetectionStrategy,
  Component,
  provideZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormComponent } from './form/form.component';
import { provideSignalFormsConfig } from '@angular/forms/signals';

@Component({
  selector: 'app-root',
  template: '<app-form />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormComponent],
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),
    provideSignalFormsConfig({
      classes: {
        'field-valid': (s) => s.valid(),
        'field-invalid': (s) => s.invalid() && s.touched() && !s.pending(),
        'field-pending': (s) => s.pending(),
      },
    }),
  ],
});
