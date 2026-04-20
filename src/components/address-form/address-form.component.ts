import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Address } from './address-form.model';
import { ValidationErrorsComponent } from '../../common/validation-errors/validation-errors.component';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  imports: [FormField, ValidationErrorsComponent],
})
export class AddressFormComponent {
  readonly form = input.required<FieldTree<Address>>();
}
