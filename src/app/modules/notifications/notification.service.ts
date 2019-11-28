import { EventEmitter } from '@angular/core';
import { Client } from '../../services/api';
import { SocketsService } from '../../services/sockets';
import { Session } from '../../services/session';
import { MindsTitle } from '../../services/ux/title';
import { Subscription, timer } from 'rxjs';
import { SiteService } from '../../common/services/site.service';

export class NotificationService {
  socketSubscriptions: any = {
    notification: null,
  };
  onReceive: EventEmitter<any> = new EventEmitter();
  notificationPollTimer;

  private updateNotificationCountSubscription: Subscription;

  static _(
    session: Session,
    client: Client,
    sockets: SocketsService,
    title: MindsTitle,
    site: SiteService
  ) {
    return new NotificationService(session, client, sockets, title, site);
  }

  constructor(
    public session: Session,
    public client: Client,
    public sockets: SocketsService,
    public title: MindsTitle,
    protected site: SiteService
  ) {
    if (!window.Minds.notifications_count) window.Minds.notifications_count = 0;

    if (!this.site.isProDomain) {
      this.listen();
    }
  }

  /**
   * Listen to socket events
   */
  listen() {
    this.socketSubscriptions.notification = this.sockets.subscribe(
      'notification',
      guid => {
        this.increment();

        this.client
          .get(`api/v1/notifications/single/${guid}`)
          .then((response: any) => {
            if (response.notification) {
              this.onReceive.next(response.notification);
            }
          });
      }
    );
  }

  /**
   * Increment the notifications counter
   */
  increment(notifications: number = 1) {
    window.Minds.notifications_count =
      window.Minds.notifications_count + notifications;
    this.sync();
  }

  /**
   * Clear the notifications. For notification controller
   */
  clear() {
    window.Minds.notifications_count = 0;
    this.sync();
  }

  /**
   * Return the notifications
   */
  getNotifications() {
    const pollIntervalSeconds = 60;
    this.notificationPollTimer = timer(0, pollIntervalSeconds * 1000);
    this.updateNotificationCountSubscription = this.notificationPollTimer.subscribe(
      () => this.updateNotificationCount()
    );
  }

  updateNotificationCount() {
    if (!this.session.isLoggedIn()) {
      return;
    }

    if (!window.Minds.notifications_count) {
      window.Minds.notifications_count = 0;
    }

    this.client.get('api/v1/notifications/count', {}).then((response: any) => {
      window.Minds.notifications_count = response.count;
      this.sync();
    });
  }

  /**
   * Sync Notifications to the topbar Counter
   */
  sync() {
    for (var i in window.Minds.navigation.topbar) {
      if (window.Minds.navigation.topbar[i].name === 'Notifications') {
        window.Minds.navigation.topbar[i].extras.counter =
          window.Minds.notifications_count;
      }
    }
    this.title.setCounter(window.Minds.notifications_count);
  }

  ngOnDestroy() {
    this.updateNotificationCountSubscription.unsubscribe();
  }
}
