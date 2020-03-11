import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Session } from '../../../../services/session';
import { Subscription } from 'rxjs';
import { MindsUser } from '../../../../interfaces/entities';

import { SettingsV2Service } from '../../settings-v2.service';

@Component({
  selector: 'm-settingsV2__deleteAccount',
  templateUrl: './delete-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2DeleteAccountComponent implements OnInit {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  init: boolean = false;
  inProgress: boolean = false;
  user: MindsUser;
  settingsSubscription: Subscription;
  form;

  constructor(
    protected cd: ChangeDetectorRef,
    private session: Session,
    protected settingsService: SettingsV2Service
  ) {}

  ngOnInit() {
    // this.user = this.session.getLoggedInUser();
    // this.form = new FormGroup({
    //   agree: new FormControl(''),
    // });
    // this.settingsSubscription = this.settingsService.settings$.subscribe(
    //   (settings: any) => {
    //     this.mature.setValue(!!parseInt(settings.mature, 10));
    //     this.detectChanges();
    //   }
    // );
    // this.init = true;
    // this.detectChanges();
  }

  //   async update() {
  //     if (!this.canSubmit()) {
  //       return;
  //     }
  //     try {
  //       this.inProgress = true;
  //       this.detectChanges();

  //       const formValue = {
  //         mature: this.mature.value ? 1 : 0,
  //       };

  //       const response: any = await this.settingsService.updateSettings(
  //         this.user.guid,
  //         formValue
  //       );
  //       if (response.status === 'success') {
  //         this.formSubmitted.emit({ formSubmitted: true });
  //         this.form.markAsPristine();
  //       }
  //     } catch (e) {
  //       this.formSubmitted.emit({ formSubmitted: false, error: e });
  //     } finally {
  //       this.inProgress = false;
  //       this.detectChanges();
  //     }
  //   }

  //   canSubmit(): boolean {
  //     return this.form.valid && !this.inProgress && !this.form.pristine;
  //   }

  //   detectChanges() {
  //     this.cd.markForCheck();
  //     this.cd.detectChanges();
  //   }

  //   ngOnDestroy() {
  //     if (this.settingsSubscription) {
  //       this.settingsSubscription.unsubscribe();
  //     }
  //   }

  //   get agree() {
  //     return this.form.get('agree');
  //   }
  // }
}
