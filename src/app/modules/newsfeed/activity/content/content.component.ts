import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription, timer } from 'rxjs';

import { Router } from '@angular/router';
import {
  ACTIVITY_COMMENTS_MORE_HEIGHT,
  ACTIVITY_COMMENTS_POSTER_HEIGHT,
  ACTIVITY_CONTENT_PADDING,
  ACTIVITY_FIXED_HEIGHT_HEIGHT,
  ACTIVITY_FIXED_HEIGHT_RATIO,
  ACTIVITY_OWNERBLOCK_HEIGHT,
  ACTIVITY_TOOLBAR_HEIGHT,
  ActivityEntity,
  ActivityService,
} from '../activity.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { MediaModalComponent } from '../../../media/modal/modal.component';
import { ConfigsService } from '../../../../common/services/configs.service';
import { RedirectService } from '../../../../common/services/redirect.service';

@Component({
  selector: 'm-activity__content',
  templateUrl: 'content.component.html',
})
export class ActivityContentComponent
  implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Whether or not we allow autoplay on scroll
   */
  @Input() allowAutoplayOnScroll: boolean = false;

  /**
   * Whether or not autoplay is allowed (this is used for single entity view, media modal and media view)
   */
  @Input() autoplayVideo: boolean = false;

  @ViewChild('mediaEl', { static: false, read: ElementRef })
  mediaEl: ElementRef;

  @ViewChild('messageEl', { static: false, read: ElementRef })
  messageEl: ElementRef;

  @ViewChild('mediaDescriptionEl', { static: false, read: ElementRef })
  mediaDescriptionEl: ElementRef;

  maxFixedHeightContent: number = 750 * ACTIVITY_FIXED_HEIGHT_RATIO;
  get maxMessageHeight(): number {
    return this.service.displayOptions.fixedHeight ? 130 : 320; // This is actually remind
  }

  activityHeight: number;
  remindWidth: number;
  remindHeight: number;

  private entitySubscription: Subscription;
  private activityHeightSubscription: Subscription;

  readonly siteUrl: string;

  entity: ActivityEntity;

  constructor(
    public service: ActivityService,
    private overlayModal: OverlayModalService,
    private router: Router,
    private el: ElementRef,
    private redirectService: RedirectService,
    configs: ConfigsService
  ) {
    this.siteUrl = configs.get('site_url');
  }

  ngOnInit() {
    this.entitySubscription = this.service.entity$.subscribe(
      (entity: ActivityEntity) => {
        this.entity = entity;
        this.calculateFixedContentHeight();
      }
    );
    this.activityHeightSubscription = this.service.height$.subscribe(
      (height: number) => {
        this.activityHeight = height;
        this.calculateRemindHeight();
      }
    );
  }

  ngAfterViewInit() {
    // Run after view initialized
    timer(0)
      .toPromise()
      .then(() => this.calculateRemindHeight());
  }

  ngOnDestroy() {
    this.entitySubscription.unsubscribe();
    this.activityHeightSubscription.unsubscribe();
  }

  get message(): string {
    // No message if media post
    if (this.mediaDescription || this.mediaTitle) return '';

    // No message if the same as blog title
    if (
      this.entity.perma_url &&
      (!this.entity.message || this.entity.title === this.entity.message)
    )
      return '';

    return this.entity.message || this.entity.title;
  }

  get isRichEmbed(): boolean {
    return !!this.entity.perma_url && !this.isVideo && !this.isImage;
  }

  get mediaTitle(): string {
    return this.isImage || this.isVideo ? this.entity.title : '';
  }

  get mediaDescription(): string {
    return (this.isImage || this.isVideo) &&
      this.entity.message !== this.entity.title
      ? this.entity.message
      : '';
  }

  get isVideo(): boolean {
    return this.entity.custom_type == 'video';
  }

  get videoGuid(): string {
    return this.entity.entity_guid;
  }

  get isImage(): boolean {
    return (
      this.entity.custom_type == 'batch' ||
      (this.entity.thumbnail_src &&
        !this.entity.perma_url &&
        this.entity.custom_type !== 'video')
    );
  }

  get imageUrl(): string {
    if (this.entity.custom_type == 'batch') {
      return this.entity.custom_data[0].src;
    }

    if (this.entity.thumbnail_src && this.entity.custom_type !== 'video') {
      return this.entity.thumbnail_src;
    }

    return ''; // TODO: placehol;der
  }

  get imageHeight(): string {
    if (this.service.displayOptions.fixedHeight) return null;
    if (this.entity.custom_type !== 'batch') return null;
    const originalHeight = parseInt(this.entity.custom_data[0].height || 0);
    const originalWidth = parseInt(this.entity.custom_data[0].width || 0);

    if (!originalHeight || !originalWidth) return null;

    const ratio = originalHeight / originalWidth;

    const height = this.el.nativeElement.clientWidth * ratio;
    return `${height}px`;
  }

  get imageGuid(): string {
    return this.entity.entity_guid;
  }

  get isTextOnly(): boolean {
    return !(
      this.isImage ||
      this.isVideo ||
      this.isRichEmbed ||
      this.entity.remind_object
    );
  }

  get videoHeight(): string {
    if (!this.mediaEl) return '';
    const height = this.mediaEl.nativeElement.clientWidth / (16 / 9);
    return `${height}px`;
  }

  calculateFixedContentHeight(): void {
    if (!this.service.displayOptions.fixedHeight) {
      return;
    }
    let contentHeight = this.activityHeight || ACTIVITY_FIXED_HEIGHT_HEIGHT;
    contentHeight = contentHeight - ACTIVITY_CONTENT_PADDING;
    if (this.service.displayOptions.showOwnerBlock) {
      contentHeight = contentHeight - ACTIVITY_OWNERBLOCK_HEIGHT;
    }
    if (this.service.displayOptions.showToolbar) {
      contentHeight = contentHeight - ACTIVITY_TOOLBAR_HEIGHT;
    }
    if (this.service.displayOptions.showComments) {
      contentHeight = contentHeight - ACTIVITY_COMMENTS_POSTER_HEIGHT;
    }
    if (
      this.service.displayOptions.showComments &&
      this.entity['comments:count'] > 0
    ) {
      contentHeight = contentHeight - ACTIVITY_COMMENTS_MORE_HEIGHT;
    }

    this.maxFixedHeightContent = contentHeight;
  }

  @HostListener('window:resize')
  calculateRemindHeight(): void {
    if (!this.service.displayOptions.fixedHeight) return;
    const messageHeight = this.messageEl
      ? this.messageEl.nativeElement.clientHeight
      : 0;

    this.calculateFixedContentHeight();

    const maxFixedHeightContent = this.maxFixedHeightContent;

    this.remindHeight = maxFixedHeightContent - messageHeight;

    //if (this.entity['remind_object'].)
    //this.remindWidth = this.remindHeight * ACTIVITY_FIXED_HEIGHT_RATIO;
  }

  onModalRequested(event: MouseEvent) {
    if (!this.overlayModal.canOpenInModal()) {
      return;
    }

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (
      this.entity.perma_url &&
      this.entity.perma_url.indexOf(this.siteUrl) === 0
    ) {
      this.redirectService.redirect(this.entity.perma_url);
      return; // Don't open modal for minds links
    }

    this.entity.modal_source_url = this.router.url;

    this.overlayModal
      .create(
        MediaModalComponent,
        { entity: this.entity },
        {
          class: 'm-overlayModal--media',
        }
      )
      .present();
  }

  onImageError(e: Event): void {}
}
