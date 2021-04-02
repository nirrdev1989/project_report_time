import { Directive, OnInit, ElementRef, Input } from '@angular/core';

@Directive({
   selector: '[styleElement]'
})
export class StyleElementDirective implements OnInit {

   @Input('styleElement') styleElement: string
   @Input() selector: string

   constructor(
      private element: ElementRef,
   ) { }

   ngOnInit(): void {
      const element = this.element.nativeElement.querySelector(this.selector)
      element.classList.add(this.styleElement)
   }
}
