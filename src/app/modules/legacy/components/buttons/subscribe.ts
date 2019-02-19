import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Session } from '../../../../services/session';
import { Client } from '../../../../services/api';
import { SignupModalService } from '../../../../modules/modals/signup/service';

@Component({
  selector: 'minds-button-subscribe',
  template: `
    <button class="m-btn m-btn--with-icon m-btn--subscribe" *ngIf="!_user.subscribed" (click)="subscribe($event)">
      <i class="material-icons">person_add</i>
      <span>
        <ng-container i18n="@@M__ACTION__SUBSCRIBE">Subscribe</ng-container>
      </span>
    </button>
    <button class="m-btn m-btn--with-icon m-btn--subscribe subscribed" *ngIf="_user.subscribed" (click)="unSubscribe($event)">
      <i class="material-icons">close</i>
      <span>
        <ng-container i18n="@@MINDS__BUTTONS__UNSUBSCRIBE__SUBSCRIBED_LABEL">Unsubscribe</ng-container>
      </span>
    </button>
  `
})

export class SubscribeButton {

  _user: any = {
    subscribed: false
  };
  _inprogress: boolean = false;
  _content: any;
  _listener: Function;
  showModal: boolean = false;
  @Output('subscribed') onSubscribed: EventEmitter<any> = new EventEmitter();

  constructor(public session: Session, public client: Client, public modal: SignupModalService) {
  }

  @Input('user')
  set user(value: any) {
    this._user = value;
  }

  subscribe(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.session.isLoggedIn()) {
      this.modal.setSubtitle('You need to have a channel in order to subscribe').open();
      return false;
    }

    this._user.subscribed = true;
    this.onSubscribed.next();
    
    this.client.post('api/v1/subscribe/' + this._user.guid, {})
      .then((response: any) => {
        if (response && response.error) {
          throw 'error';
        }

        this._user.subscribed = true;
      })
      .catch((e) => {
        this._user.subscribed = false;
        alert('You can\'t subscribe to this user.');
      });
  }

  unSubscribe(e) {
    e.preventDefault();
    e.stopPropagation();
    this._user.subscribed = false;
    this.client.delete('api/v1/subscribe/' + this._user.guid, {})
      .then((response: any) => {
        this._user.subscribed = false;
      })
      .catch((e) => {
        this._user.subscribed = true;
      });
  }

}
