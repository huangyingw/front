import { Component, Input, ElementRef, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { MindsTitle } from '../../services/ux/title';
import { Client } from '../../services/api/client';
import { Session } from '../../services/session';
import { NotificationService } from './notification.service';

@Component({
  moduleId: module.id,
  selector: 'minds-notifications',
  templateUrl: 'notifications.component.html'
})

export class NotificationsComponent {

  @Input() visible: boolean = true;
  @Input() params: any;
  @Input() count: number;
  @Input() loadOnDemand: boolean;
  @ViewChild('notificationGrid') notificationList: ElementRef;
  notifications: Array<Object> = [];
  entity;
  moreData: boolean = true;
  offset: string = '';
  inProgress: boolean = false;
  _filter: string = 'all';

  minds: any = window.Minds;
  paramsSubscription: Subscription;

  constructor(
    public session: Session,
    public client: Client,
    public router: Router,
    public title: MindsTitle,
    public notificationService: NotificationService,
    public route: ActivatedRoute,
    public el: ElementRef,
  ) { }

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      if (!this.loadOnDemand)
        this.router.navigate(['/login']);
      return;
    }

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['filter']) {
        this._filter = params['filter'];
        this.notifications = [];
        this.load(true);
      }
      if (params['ts']) {
        this.notifications = [];
        this.load(true);
        this.notificationService.clear();
      }
    });

    this.notificationService.clear();
    if (!this.loadOnDemand) {
      this.title.setTitle('Notifications');
      this.load(true);
    }

  }

  onVisible() {
    if (this.notifications.length === 0 ) {
      this.load(true);
    } else {
      setTimeout(() => {
        if (this.minds.notifications_count > 0 && this.notificationList.nativeElement.scrollTop <= 100) {
          this.load(true);
        }
      }, 200);
    }
  }
  
  ngOnDestroy() {
    if (this.paramsSubscription)
      this.paramsSubscription.unsubscribe();
  }

  load(refresh: boolean = false) {
    if (this.inProgress) return false;

    if (refresh)
      this.offset = '';

    this.inProgress = true;

    this.client.get(`api/v1/notifications/${this._filter}`, { limit: 24, offset: this.offset })
      .then((data: any) => {

        if (!data.notifications) {
          this.moreData = false;
          this.inProgress = false;
          return false;
        }

        if (refresh) {
          this.notifications = data.notifications;
        } else {
          for (let entity of data.notifications)
            this.notifications.push(entity);
        }

        if (!data['load-next'])
          this.moreData = false;
        this.offset = data['load-next'];
        this.inProgress = false;
        this.minds.notifications_count = 0;
        this.notificationService.clear();
      });
  }

  loadEntity(entity) {
    if (entity.type === 'comment') {
      this.client.get('api/v1/entities/entity/' + entity.parent_guid)
        .then((response: any) => {
          this.entity = response.entity;
        });
    } else {
      this.entity = entity;
    }
  }

  changeFilter(filter) {
      this._filter = filter;
      this.notifications = [];
      this.load(true);
  }
}
