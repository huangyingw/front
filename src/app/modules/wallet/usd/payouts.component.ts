import { Component, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';

import { DynamicHostDirective } from '../../../common/directives/dynamic-host.directive';
import { RevenueLedgerComponent } from '../../monetization/revenue/ledger.component';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-wallet--usd--payouts',
  template: `
    <ng-template dynamic-host></ng-template>
  `,
})
export class WalletUSDPayoutsComponent {
  @ViewChild(DynamicHostDirective, { static: true }) host: DynamicHostDirective;

  componentRef;
  componentInstance: RevenueLedgerComponent;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private router: Router,
    private session: Session
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.loadComponent();
  }

  loadComponent() {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
        RevenueLedgerComponent
      ),
      viewContainerRef = this.host.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentInstance = this.componentRef.instance;
  }
}
