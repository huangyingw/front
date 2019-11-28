import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'm-tooltip',
  templateUrl: 'tooltip.component.html',
  host: {
    '(mouseover)': 'setHidden(false)',
    '(mouseout)': 'setHidden(true)',
  },
})
export class TooltipComponent {
  @Input() icon;
  @Input() anchor: 'top' | 'bottom' | 'right' | 'left';
  @Input() iconClass;
  @Input() useParentPosition: boolean = false;

  hidden: boolean = true;
  offsetTop: number = 0;
  offsetRight: number = 0;
  offsetLeft: number = 0;

  constructor(private element: ElementRef) {}

  setHidden(value: boolean) {
    this.hidden = value;

    if (!this.hidden && this.useParentPosition) {
      switch (this.anchor) {
        case 'top':
          this.anchorTop();
          break;
        case 'bottom':
          this.anchorBottom();
          break;
        case 'left':
          this.anchorLeft();
          break;
        case 'right':
          this.anchorRight();
          break;
      }
    }
  }

  anchorTop() {
    this.resetOffsets();

    const clientRect: ClientRect = this.element.nativeElement.parentElement.getBoundingClientRect();
    this.offsetTop = clientRect.top + clientRect.height - 8;

    let left = clientRect.left;

    this.offsetLeft = Math.abs(left);
  }

  anchorBottom() {
    this.resetOffsets();

    const clientRect: ClientRect = this.element.nativeElement.parentElement.getBoundingClientRect();
    this.offsetTop = clientRect.bottom;

    let left = clientRect.left;

    this.offsetLeft = Math.abs(left);
  }

  anchorLeft() {
    this.resetOffsets();

    const clientRect: ClientRect = this.element.nativeElement.parentElement.getBoundingClientRect();
    this.offsetTop = clientRect.top;

    let left = clientRect.left + clientRect.width;

    if (left + clientRect.width >= window.innerWidth) {
      this.offsetRight =
        window.innerWidth - clientRect.right + clientRect.width;
    } else {
      this.offsetLeft = Math.abs(left);
    }
  }

  anchorRight() {
    this.resetOffsets();

    const clientRect: ClientRect = this.element.nativeElement.parentElement.getBoundingClientRect();
    this.offsetTop = clientRect.top;

    let right = window.innerWidth - clientRect.left;

    if (right >= window.innerWidth) {
      right = 0;
      this.offsetLeft = clientRect.left + clientRect.width;
    }

    this.offsetRight = Math.abs(right);
  }

  resetOffsets() {
    this.offsetTop = this.offsetLeft = this.offsetRight = undefined;
  }
}
