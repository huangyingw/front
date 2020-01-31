import {
  Component,
  ElementRef,
  forwardRef,
  OnChanges,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  HostListener,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Country } from './country';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CountryCode } from './countries';

export const PHONE_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PhoneInputV2Component),
  multi: true,
};

@Component({
  selector: 'm-phoneInput',
  templateUrl: 'phone-input-v2.component.html',
  providers: [PHONE_INPUT_VALUE_ACCESSOR],
})
export class PhoneInputV2Component
  implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  @Input() invalid: boolean = false;

  phoneNumber: string = '';
  showDropdown: boolean = false;
  inputFocused: boolean = false;

  @ViewChild('wrapper', { static: true }) wrapper: ElementRef;
  @ViewChild('input', { static: true }) input: ElementRef;
  selectedCountry;

  propagateChange = (_: any) => {};

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  public onPhoneNumberChange(): void {
    this.propagateChange(this.number);
  }

  public onInputKeyPress(event: KeyboardEvent): void {
    const allowedKeyCodes: Array<number> = [8, 33, 34, 35, 36, 37, 39, 46];
    const pattern = /[0-9\+\-\ ]/,
      inputChar = String.fromCharCode(event.charCode);
    if (
      !pattern.test(inputChar) &&
      allowedKeyCodes.indexOf(event.keyCode) === -1
    ) {
      event.preventDefault();
    }
  }

  get number() {
    return this.selectedCountry.dialCode + this.phoneNumber;
  }

  ngOnChanges(changes: any) {
    this.propagateChange(changes);
  }

  writeValue(value: any) {
    if (value && value.length > 10) {
      this.phoneNumber = value.substring(value.length - 11, value.length - 1);
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {}

  toggledDropdown($event) {
    this.showDropdown = $event.showDropdown;
  }

  countrySelected($event) {
    this.selectedCountry = $event;
    this.onPhoneNumberChange();
    this.input.nativeElement.focus();
    this.inputFocused = true;
  }

  clickedInput($event) {
    $event.stopPropagation();
    this.inputFocused = true;
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  clickedAnywhere($event) {
    this.showDropdown = false;
  }

  ngOnDestroy() {
    this.showDropdown = false;
  }
}
