import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { Web3WalletService } from '../../../blockchain/web3-wallet.service';
import { WalletDashboardService } from '../dashboard.service';

import * as moment from 'moment';

@Component({
  selector: 'm-walletTransactions--cash',
  templateUrl: './transactions-cash.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletTransactionsCashComponent implements OnInit {
  init: boolean = false;
  inProgress: boolean = true;
  offset: string;
  moreData: boolean = true;
  currency: string = 'USD';

  transactions: any[] = [];
  runningTotal: number = 0;
  currentDayInLoop = moment();

  filterApplied: boolean = false;

  showRewardsPopup: boolean = false;

  constructor(
    protected client: Client,
    protected web3Wallet: Web3WalletService,
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected route: ActivatedRoute,
    protected session: Session,
    protected walletService: WalletDashboardService
  ) {}

  ngOnInit() {
    this.getStripeAccount();
  }

  async getStripeAccount() {
    const stripeAccount = await this.walletService.getStripeAccount();
    if (!stripeAccount) {
      return;
    } else {
      console.log('got stripeAccount', stripeAccount);
      if (stripeAccount.bankAccount) {
        this.currency = stripeAccount.bankAccount.currency.toUpperCase();
      }
      this.runningTotal =
        (stripeAccount.totalBalance.amount -
          stripeAccount.pendingBalance.amount) /
        100;

      console.log('running', this.runningTotal);
    }

    this.load(true);
  }

  async load(refresh: boolean) {
    if (this.inProgress && !refresh) {
      return;
    }

    if (refresh) {
      this.transactions = [];
      this.offset = '';
      this.moreData = true;
    }

    this.inProgress = true;
    this.detectChanges();

    try {
      const opts: any = {
        offset: this.offset,
      };

      const response: any = await this.walletService.getStripeTransactions(
        opts
      );

      if (refresh) {
        this.transactions = [];
      }

      if (response) {
        if (response && response.transactions) {
          this.formatResponse(response.transactions);
        }

        if (response['load-next']) {
          this.offset = response['load-next'];
        } else {
          this.moreData = false;
          this.inProgress = false;
        }
      } else {
        console.error('No data');
        this.moreData = false;
        this.inProgress = false;
      }
    } catch (e) {
      console.error(e);
      this.moreData = false;
    } finally {
      this.init = true;
      this.inProgress = false;
      this.detectChanges();
    }
  }

  formatResponse(transactions) {
    transactions.forEach(tx => {
      const formattedTx: any = {};

      formattedTx.amount = tx.amount / 100;

      if (tx.type !== 'payout') {
        this.runningTotal -= formattedTx.amount;
      } else {
        this.runningTotal = 0;
      }
      formattedTx.runningTotal = this.runningTotal;

      formattedTx.timestamp = tx.timestamp;
      formattedTx.type = tx.type;
      formattedTx.superType = tx.type;
      console.log('tx.type', tx.type);

      if (formattedTx.superType === 'payout') {
        formattedTx.showRewardsPopup = false;
      }

      if (formattedTx.superType === 'wire') {
        formattedTx.otherUser = this.getOtherUser(tx);
      }

      formattedTx.delta = this.getDelta(tx);

      const txMoment = moment(tx.timestamp * 1000).local();
      formattedTx.displayDate = null;
      formattedTx.displayTime = txMoment.format('hh:mm a');

      if (this.isNewDay(this.currentDayInLoop, txMoment)) {
        this.currentDayInLoop = txMoment;

        // If tx occured yesterday, use 'yesterday' instead of date
        const yesterday = moment().subtract(1, 'day');
        if (txMoment.isSame(yesterday, 'day')) {
          formattedTx.displayDate = 'Yesterday';
        } else {
          formattedTx.displayDate = moment(txMoment).format('ddd MMM Do');
        }
      }
      this.transactions.push(formattedTx);
    });
    console.log(this.transactions);
    this.inProgress = false;
  }

  isNewDay(moment1, moment2) {
    return !moment1.isSame(moment2, 'day');
  }

  getOtherUser(tx) {
    const isSender = false,
      user = tx.customer_user;

    return {
      avatar: `/icon/${user.guid}/medium/${user.icontime}`,
      username: user.username,
      isSender,
    };
  }

  getDelta(tx) {
    let delta = 'neutral';
    if (tx.type !== 'payout') {
      delta = tx.amount < 0 ? 'negative' : 'positive';
    }
    return delta;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
