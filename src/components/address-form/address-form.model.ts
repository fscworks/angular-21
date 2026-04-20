import { required, pattern, SchemaPathTree } from '@angular/forms/signals';
import { Address } from '../../common/models';

export function buildAddressSection(a: SchemaPathTree<Address>) {
  required(a.street, { message: 'Street is required' });
  required(a.city, { message: 'City is required' });
  required(a.house, { message: 'House Nr. is required' });
  required(a.zip, { message: 'ZIP code is required' });
  pattern(a.zip, /^\d{5}$/, { message: 'ZIP code must be 5 digits' });
}
