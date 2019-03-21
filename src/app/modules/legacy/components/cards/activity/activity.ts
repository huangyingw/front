import { Component, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, ElementRef, Input, ViewChild } from '@angular/core';

import { Client } from '../../../../../services/api';
import { Session } from '../../../../../services/session';
import { ScrollService } from '../../../../../services/ux/scroll';
import { AttachmentService } from '../../../../../services/attachment';
import { TranslationService } from '../../../../../services/translation';
import { OverlayModalService } from '../../../../../services/ux/overlay-modal';
import { BoostCreatorComponent } from '../../../../boost/creator/creator.component';
import { WireCreatorComponent } from '../../../../wire/creator/creator.component';
import { MindsVideoComponent } from '../../../../media/components/video/video.component';
import { NewsfeedService } from '../../../../newsfeed/services/newsfeed.service';
import { EntitiesService } from "../../../../../common/services/entities.service";
import { Router } from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'minds-activity',
  host: {
    'class': 'mdl-card m-border'
  },
  inputs: ['object', 'commentsToggle', 'focusedCommentGuid', 'visible', 'canDelete', 'showRatingToggle'],
  outputs: ['_delete: delete', 'commentsOpened', 'onViewed'],
  templateUrl: 'activity.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class Activity {

  minds = window.Minds;

  activity: any;
  boosted: boolean = false;
  commentsToggle: boolean = false;
  shareToggle: boolean = false;
  deleteToggle: boolean = false;
  translateToggle: boolean = false;
  translateEvent: EventEmitter<any> = new EventEmitter();
  showBoostOptions: boolean = false;
  @Input() boost: boolean = false;
  @Input('boost-toggle')
  @Input() showBoostMenuOptions: boolean = false;

  type: string;
  element: any;
  visible: boolean = false;

  editing: boolean = false;
  @Input() hideTabs: boolean;

  _delete: EventEmitter<any> = new EventEmitter();
  commentsOpened: EventEmitter<any> = new EventEmitter();
  @Input() focusedCommentGuid: string;
  scroll_listener;

  childEventsEmitter: EventEmitter<any> = new EventEmitter();
  onViewed: EventEmitter<{activity, visible}> = new EventEmitter<{activity, visible}>();

  isTranslatable: boolean;
  canDelete: boolean = false;
  showRatingToggle: boolean = false;

  get menuOptions(): Array<string> {
    if (!this.activity || !this.activity.ephemeral) {
      if (this.showBoostMenuOptions)  {
        return ['edit', 'translate', 'share', 'follow', 'feature', 'delete', 'report', 'set-explicit', 'block', 'rating'];
      } else {
        return ['edit', 'translate', 'share', 'follow', 'feature', 'delete', 'report', 'set-explicit', 'block', 'rating'];
      }
    } else {
      return ['view', 'translate', 'share', 'follow', 'feature', 'report', 'set-explicit', 'block', 'rating']
    }
  }

  @ViewChild('player') player: MindsVideoComponent;

  constructor(
    public session: Session,
    public client: Client,
    public scroll: ScrollService,
    public newsfeedService: NewsfeedService,
    _element: ElementRef,
    public attachment: AttachmentService,
    public translationService: TranslationService,
    private overlayModal: OverlayModalService,
    private cd: ChangeDetectorRef,
    private entitiesService: EntitiesService,
    private router: Router,
  ) {

    this.element = _element.nativeElement;
    this.isVisible();
  }

  set object(value: any) {
    if (!value)
      return;
    this.activity = value;
    this.activity.url = window.Minds.site_url + 'newsfeed/' + value.guid;

    if (
      this.activity.custom_type == 'batch' 
      && this.activity.custom_data 
      && this.activity.custom_data[0].src
    ) {
      this.activity.custom_data[0].src = this.activity.custom_data[0].src.replace(this.minds.site_url, this.minds.cdn_url);
    }
    
    if (!this.activity.message) {
      this.activity.message = '';
    }

    if (!this.activity.title) {
      this.activity.title = '';
    }

    this.boosted = this.activity.boosted || this.activity.p2p_boosted;

    this.isTranslatable = (
      this.translationService.isTranslatable(this.activity) ||
      (this.activity.remind_object && this.translationService.isTranslatable(this.activity.remind_object))
    );
  }

  getOwnerIconTime() {
    let session = this.session.getLoggedInUser();
    if(session && session.guid === this.activity.ownerObj.guid) {
      return session.icontime;
    } else {
      return this.activity.ownerObj.icontime;
    }
  }

  @Input() set boostToggle(toggle: boolean) {
    //if(toggle)
    //  this.showBoost();
    return;
  }

  save() {
    console.log('trying to save your changes to the server', this.activity);
    this.editing = false;
    this.activity.edited = true;

    let data = Object.assign(this.activity, this.attachment.exportMeta());
    this.client.post('api/v1/newsfeed/' + this.activity.guid, data);
  }

  delete($event: any = {}) {
    if ($event.inProgress) {
      $event.inProgress.emit(true);
    }
    this.client.delete(`api/v1/newsfeed/${this.activity.guid}`)
      .then((response: any) => {
        if ($event.inProgress) {
          $event.inProgress.emit(false);
          $event.completed.emit(0);
        }
        this._delete.next(this.activity);
      })
      .catch(e => {
        if ($event.inProgress) {
          $event.inProgress.emit(false);
          $event.completed.emit(1);
        }
      });
  }

  /*async setSpam(value: boolean) {
    this.activity['spam'] = value;

    try {
      if (value) {
        await this.client.put(`api/v1/admin/spam/${this.activity.guid}`);
      } else {
        await this.client.delete(`api/v1/admin/spam/${this.activity.guid}`);
      }
    } catch (e) {
      this.activity['spam'] = !value;
    }
  }

  async setDeleted(value: boolean) {
    this.activity['deleted'] = value;

    try {
      if (value) {
        await this.client.put(`api/v1/admin/delete/${this.activity.guid}`);
      } else {
        await this.client.delete(`api/v1/admin/delete/${this.activity.guid}`);
      }
    } catch (e) {
      this.activity['delete'] = !value;
    }
  }*/

  openComments() {
    this.commentsToggle = !this.commentsToggle;
    this.commentsOpened.emit(this.commentsToggle);
  }

  async togglePin() {

    if (this.session.getLoggedInUser().guid != this.activity.owner_guid) {
      return;
    }

    this.activity.pinned = !this.activity.pinned;
    const url: string = `api/v2/newsfeed/pin/${this.activity.guid}`;
    try {
      if (this.activity.pinned) {
        await this.client.post(url);
      } else {
        await this.client.delete(url);
      }
    } catch (e) {
      this.activity.pinned = !this.activity.pinned;
    }
  }

  async showBoost() {
    let activity = this.activity;

    if (activity.ephemeral) {
      activity = await this.entitiesService.single(activity.entity_guid);

      if (!activity) {
        throw new Error('Invalid entity');
      }
    }

    const boostModal = this.overlayModal.create(BoostCreatorComponent, activity);

    boostModal.onDidDismiss(() => {
      this.showBoostOptions = false;
    });

    boostModal.present();
  }

  async showWire() {
    if(this.session.getLoggedInUser().guid !== this.activity.owner_guid) {
      let activity = this.activity;

      if (activity.ephemeral) {
        activity = await this.entitiesService.single(activity.entity_guid);

        if (!activity) {
          throw new Error('Invalid entity');
        }
      }

      this.overlayModal.create(WireCreatorComponent,
        activity.remind_object ? activity.remind_object : activity,
        { onComplete: wire => this.wireSubmitted(wire) })
          .present();
    }
  }

  async wireSubmitted(wire?) {
    if (wire && this.activity.wire_totals) {
      this.activity.wire_totals.tokens =
        parseFloat(this.activity.wire_totals.tokens) + (wire.amount * Math.pow(10, 18));

      this.detectChanges();
    }
  }

  menuOptionSelected(option: string) {
    switch (option) {
      case 'view':
        this.router.navigate(['/newsfeed', this.activity.guid ]);
        break;
      case 'edit':
        this.editing = true;
        break;
      case 'delete':
        this.delete();
        break;
      case 'set-explicit':
        this.setExplicit(true);
        break;
      case 'remove-explicit':
        this.setExplicit(false);
        break;
      case 'translate':
        this.translateToggle = true;
        break;
    }
  }

  setExplicit(value: boolean) {
    let oldValue = this.activity.mature,
      oldMatureVisibility = this.activity.mature_visibility;

    this.activity.mature = value;
    this.activity.mature_visibility = void 0;

    if (this.activity.custom_data && this.activity.custom_data[0]) {
      this.activity.custom_data[0].mature = value;
    } else if (this.activity.custom_data) {
      this.activity.custom_data.mature = value;
    }

    this.client.post(`api/v1/entities/explicit/${this.activity.guid}`, { value: value ? '1' : '0' })
      .catch(e => {
        this.activity.mature = oldValue;
        this.activity.mature_visibility = oldMatureVisibility;

        if (this.activity.custom_data && this.activity.custom_data[0]) {
          this.activity.custom_data[0].mature = oldValue;
        } else if (this.activity.custom_data) {
          this.activity.custom_data.mature = oldValue;
        }
      });
  }

  onNSWFSelections(reasons: Array<{ value, label, selected}>) {
    this.attachment.setNSFW(reasons);
  }

  private viewed:boolean = false;

  isVisible() {
    if (this.visible) {
      this.onViewed.emit({activity: this.activity, visible: true});
      return true;
    }
    this.scroll_listener = this.scroll.listenForView().subscribe((view) => {
      if (this.element.offsetTop - this.scroll.view.clientHeight <= this.scroll.view.scrollTop && !this.visible) {
        //stop listening
        this.scroll.unListen(this.scroll_listener);
        //make visible
        this.visible = true;

        //this.onViewed.emit({activity: this.activity, visible: true});
        //update the analytics
        this.newsfeedService.recordView(this.activity);
      }
    });
  }

  ngOnDestroy() {
    this.scroll.unListen(this.scroll_listener);
  }

  propagateTranslation($event) {
    if (this.activity.remind_object && this.translationService.isTranslatable(this.activity.remind_object)) {
      this.childEventsEmitter.emit({
        action: 'translate',
        args: [$event]
      });
    }
  }

  hide() {
    if (this.player) {
      this.player.pause();
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
