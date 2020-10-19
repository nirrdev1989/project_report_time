import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[styleElement]'
})
export class StyleElementDirective implements OnInit {

    @Input() changeClass: string
    @Input() selector: string

    constructor(private element: ElementRef) {
        // console.log(this.element.nativeElement.children)
    }

    ngOnInit(): void {
        const element = this.element.nativeElement.querySelector(this.selector)
        element.classList.add(this.changeClass)
    }
}
