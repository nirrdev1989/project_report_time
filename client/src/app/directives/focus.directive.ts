import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';

@Directive({
   selector: '[appInputFocus]'
})
export class InputFocusDirective implements OnInit {

   constructor(private formElement: ElementRef, private render: Renderer2) { }

   ngOnInit(): void {
      this.formElement.nativeElement[0].focus()
      this.formElement.nativeElement[0].blur()
   }

   @HostListener('input')
   check(): void {
      this.focusAndBlur()
   }


   @HostListener('click')
   onClick(): void {
      this.focusAndBlur()
   }

   focusAndBlur(): void {
      setTimeout(() => {
         const input = this.formElement.nativeElement.querySelector('.ng-invalid')
         if (input) {
            input.focus();
            input.blur()
         }
      }, 0);
   }

}
