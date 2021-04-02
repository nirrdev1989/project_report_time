import { Directive, ElementRef, HostListener, Input } from '@angular/core';


@Directive({
   selector: '[appRemoveAttr]'
})
export class RemoveAttrDirective {

   @Input() appRemoveAttr: string
   @Input('elementName') elementName: string

   constructor(private parentElemet: ElementRef) { }

   @HostListener('click', ['$event'])
   onClick(event: any): void {
      const elements = this.parentElemet.nativeElement.querySelectorAll(this.elementName)
      elements.forEach((element: HTMLElement) => {
         if (element.id !== event.target.id) {
            element.removeAttribute(this.appRemoveAttr)
         }
      })
   }

}
