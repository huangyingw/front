import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WireType, WireV2Service } from '../../wire-v2.service';

@Component({
  selector: 'm-wireCreator__form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'form.component.html',
  styleUrls: ['form.component.ng.scss'],
})
export class WireCreatorFormComponent {
  /**
   * Constructor
   * @param service
   */
  constructor(public service: WireV2Service) {}

  /**
   * Sanitizes and sets the payment amount
   * @param amount
   */
  setAmount(amount: string): void {
    amount = amount.trim();

    if (amount.slice(-1) === '.') {
      // If we're in the middle of writing a decimal value, don't process it
      return;
    }

    const numericAmount = parseFloat(amount.replace(/,/g, '') || '0');

    if (isNaN(numericAmount)) {
      return;
    }

    // TODO: Remove non-digits properly to avoid NaN
    this.service.setAmount(numericAmount);
  }

  /**
   * Sets the type of the wire service and the default amount.
   * @param { WireType } the currency e.g. 'eth', 'btc'.
   * @returns { void }
   */
  public setType(type: WireType): void {
    if (type === 'eth' || type === 'btc') {
      this.service.amount$.next(0.01);
    } else {
      this.service.amount$.next(1);
    }
    this.service.setType(type);
  }
}
