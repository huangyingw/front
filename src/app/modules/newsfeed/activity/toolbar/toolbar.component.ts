import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivityService, ActivityEntity } from '../activity.service';
import { Session } from '../../../../services/session';
import { Router } from '@angular/router';
import { BoostCreatorComponent } from '../../../boost/creator/creator.component';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';

@Component({
  selector: 'm-activity__toolbar',
  templateUrl: 'toolbar.component.html',
})
export class ActivityToolbarComponent {
  private entitySubscription: Subscription;
  private paywallBadgeSubscription: Subscription;

  entity: ActivityEntity;
  allowReminds: boolean = true;

  constructor(
    public service: ActivityService,
    public session: Session,
    private router: Router,
    private overlayModalService: OverlayModalService
  ) {}

  ngOnInit() {
    this.entitySubscription = this.service.entity$.subscribe(
      (entity: ActivityEntity) => {
        this.entity = entity;
      }
    );

    this.paywallBadgeSubscription = this.service.shouldShowPaywallBadge$.subscribe(
      (showBadge: boolean) => {
        this.allowReminds = !showBadge;
      }
    );
  }

  ngOnDestroy() {
    this.entitySubscription.unsubscribe();
    this.paywallBadgeSubscription.unsubscribe();
  }

  toggleComments(): void {
    if (this.service.displayOptions.fixedHeight) {
      this.router.navigate([`/newsfeed/${this.entity.guid}`]);
      return;
    }

    this.service.displayOptions.showOnlyCommentsInput = !this.service
      .displayOptions.showOnlyCommentsInput;
  }

  openBoostModal(e: MouseEvent): void {
    this.overlayModalService
      .create(BoostCreatorComponent, this.entity)
      .present();
  }
}
