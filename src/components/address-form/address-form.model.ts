import { signal } from '@angular/core';
import { required, pattern, SchemaPathTree } from '@angular/forms/signals';

export interface Address {
  street: string;
  city: string;
  house: string;
  zip: string;
}

export function createAddressModel() {
  return signal<Address>({
    street: '',
    city: '',
    house: '',
    zip: '',
  });
}

export function buildAddressSection(a: SchemaPathTree<Address>) {
  required(a.street, { message: 'Street is required' });
  required(a.city, { message: 'City is required' });
  required(a.house, { message: 'House Nr. is required' });
  required(a.zip, { message: 'ZIP code is required' });
  pattern(a.zip, /^\d{5}$/, { message: 'ZIP code must be 5 digits' });
}
