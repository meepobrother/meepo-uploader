import { Directive, ElementRef, Input } from '@angular/core';
@Directive({ selector: '[fileSelecter]' })
export class FileSelectDirective {
    @Input() fileSelecter: string;
    constructor(
        public ele: ElementRef
    ) { }
}