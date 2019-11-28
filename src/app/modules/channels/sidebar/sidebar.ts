import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Client, Upload } from '../../../services/api';
import { Session } from '../../../services/session';
import { MindsUser } from '../../../interfaces/entities';
import { Tag } from '../../hashtags/types/tag';
import { ChannelOnboardingService } from '../../onboarding/channel/onboarding.service';
import { Storage } from '../../../services/storage';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { ReferralsLinksComponent } from '../../wallet/tokens/referrals/links/links.component';
import { FeaturesService } from '../../../services/features.service';

@Component({
  moduleId: module.id,
  selector: 'm-channel--sidebar',
  inputs: ['user', 'editing'],
  templateUrl: 'sidebar.html',
})
export class ChannelSidebar {
  minds = window.Minds;
  filter: any = 'feed';
  isLocked: boolean = false;
  editing: boolean = false;
  user: MindsUser;
  searching;
  errorMessage: string = '';
  amountOfTags: number = 0;
  tooManyTags: boolean = false;
  onboardingProgress: number = -1;

  @Output() changeEditing = new EventEmitter<boolean>();

  // @todo make a re-usable city selection module to avoid duplication here
  cities: Array<any> = [];

  constructor(
    public client: Client,
    public upload: Upload,
    public session: Session,
    public onboardingService: ChannelOnboardingService,
    protected storage: Storage,
    private overlayModal: OverlayModalService,
    public featuresService: FeaturesService
  ) {
    if (onboardingService && onboardingService.onClose) {
      onboardingService.onClose.subscribe(progress => {
        this.onboardingProgress = -1;
        this.checkProgress();
      });
    }
  }

  ngOnInit() {
    this.checkProgress();
  }

  checkProgress() {
    this.onboardingService.checkProgress().then(() => {
      this.onboardingProgress = this.onboardingService.completedPercentage;
    });
  }

  showOnboarding() {
    this.onboardingService.onOpen.emit();
  }

  shouldShowOnboardingProgress() {
    return (
      this.session.isLoggedIn() &&
      this.session.getLoggedInUser().guid === this.user.guid &&
      !this.storage.get('onboarding_hide') &&
      this.onboardingProgress !== -1 &&
      this.onboardingProgress !== 100
    );
  }

  hideOnboardingForcefully() {
    this.storage.set('onboarding_hide', '1');
  }

  isOwner() {
    return this.session.getLoggedInUser().guid === this.user.guid;
  }

  toggleEditing() {
    if (this.tooManyTags) {
      return;
    }

    this.changeEditing.next(!this.editing);
    this.minds.user.name = this.user.name; //no need to refresh for other pages to update.
  }

  upload_avatar(file) {
    var self = this;
    this.upload
      .post('api/v1/channel/avatar', [file], { filekey: 'file' })
      .then((response: any) => {
        self.user.icontime = Date.now();
        if (window.Minds.user) window.Minds.user.icontime = Date.now();
      });
  }

  findCity(q: string) {
    if (this.searching) {
      clearTimeout(this.searching);
    }
    this.searching = setTimeout(() => {
      this.client
        .get('api/v1/geolocation/list', { q: q })
        .then((response: any) => {
          this.cities = response.results;
        });
    }, 100);
  }

  setCity(row: any) {
    this.cities = [];
    if (row.address.city) {
      this.user.city = row.address.city;
    }
    if (row.address.town) this.user.city = row.address.town;
    if (window.Minds) window.Minds.user.city = this.user.city;
    this.client.post('api/v1/channel/info', {
      coordinates: row.lat + ',' + row.lon,
      city: window.Minds.user.city,
    });
  }

  onTagsChange(tags: string[]) {
    this.amountOfTags = tags.length;
    if (this.amountOfTags > 5) {
      this.errorMessage = 'You can only select up to 5 hashtags';
      this.tooManyTags = true;
    } else {
      this.tooManyTags = false;
      this.user.tags = tags;
      if (this.errorMessage === 'You can only select up to 5 hashtags') {
        this.errorMessage = '';
      }
    }
  }

  onTagsAdded(tags: Tag[]) {}

  onTagsRemoved(tags: Tag[]) {}

  setSocialProfile(value: any) {
    this.user.social_profiles = value;
  }

  openReferralsModal() {
    this.overlayModal
      .create(
        ReferralsLinksComponent,
        {},
        {
          class: 'm-overlay-modal--referrals-links m-overlay-modal--medium',
        }
      )
      .present();
  }

  async proAdminToggle() {
    const value = !this.user.pro;
    const method = value ? 'put' : 'delete';

    this.user.pro = value;

    try {
      const response = (await this.client[method](
        `api/v2/admin/pro/${this.user.guid}`
      )) as any;

      if (!response || response.status !== 'success') {
        throw new Error('Invalid server response');
      }
    } catch (e) {
      console.error(e);
      this.user.pro = !value;
    }
  }

  get showBecomeProButton() {
    const isOwner =
      this.session.isLoggedIn() &&
      this.session.getLoggedInUser().guid == this.user.guid;
    return isOwner && !this.user.pro;
  }

  get showProSettings() {
    const isOwner =
      this.session.isLoggedIn() &&
      this.session.getLoggedInUser().guid == this.user.guid;
    const isAdmin = window.Minds.Admin;
    return (isOwner || isAdmin) && this.user.pro;
  }

  get proSettingsRouterLink() {
    const route: any[] = ['/pro/' + this.user.username + '/settings'];
    return route;
  }
}
