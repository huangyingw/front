import { Component, OnInit } from '@angular/core';
import { Session } from '../../../services/session';
import { FeaturesService } from '../../../services/features.service';
import { SidebarNavigationService } from '../../../common/layout/sidebar/navigation.service';
import { ChannelOnboardingService } from '../../onboarding/channel/onboarding.service';
import { SiteService } from '../../../common/services/site.service';
import { PageLayoutService } from '../../../common/layout/page-layout.service';
import { Router } from '@angular/router';
import { Storage } from '../../../services/storage';
import { MessengerService } from '../../messenger/messenger.service';

@Component({
  selector: 'm-page',
  templateUrl: 'page.component.html',
  styleUrls: ['page.component.ng.scss'],
})
export class PageComponent implements OnInit {
  showOnboarding: boolean = false;

  isSidebarVisible: boolean = true;

  constructor(
    public session: Session,
    public featuresService: FeaturesService,
    private navigationService: SidebarNavigationService,
    private onboardingService: ChannelOnboardingService,
    private site: SiteService,
    public pageLayoutService: PageLayoutService,
    private router: Router,
    private storage: Storage,
    private messengerService: MessengerService
  ) {}

  ngOnInit() {
    this.isSidebarVisible = this.navigationService.container
      ? !this.navigationService.container.hidden
      : true;
    this.navigationService.visibleChange.subscribe((visible: boolean) => {
      setTimeout(() => {
        this.isSidebarVisible = visible;
      });
    });

    this.session.isLoggedIn(async is => {
      if (is && !this.site.isProDomain) {
        if (!this.site.isProDomain) {
          this.showOnboarding = await this.onboardingService.showModal();
        }
      }
    });

    this.onboardingService.onClose.subscribe(() => {
      this.showOnboarding = false;
    });

    this.onboardingService.onOpen.subscribe(async () => {
      this.showOnboarding = await this.onboardingService.showModal(true);
    });

    this.messengerService.setupLegacyMessengerVisibility();
  }

  get isProDomain() {
    return this.site.isProDomain;
  }

  hasMarkersSidebar() {
    return this.session.isLoggedIn() && !this.isProDomain && false;
  }
}
