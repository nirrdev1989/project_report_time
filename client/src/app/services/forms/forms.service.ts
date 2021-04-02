import { Injectable } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Injectable({
   providedIn: 'root'
})
export class FormsService {

   constructor() { }

   formControlStatus(control: FormControl): boolean {
      if (control.invalid && (control.dirty || control.touched)) {
         return true;
      }
      return false;
   }


   displayClass(input: AbstractControl): { [key: string]: boolean } {
      return {
         'is-valid': input.valid,
         'is-invalid': input.touched && input.invalid
      }
   }
}
