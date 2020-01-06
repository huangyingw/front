import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Router, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MINDS_PIPES } from './pipes/pipes';

import { TopbarComponent } from './layout/topbar/topbar.component';
import { SidebarMarkersComponent } from './layout/sidebar/markers.component';
import { TopbarNavigationComponent } from './layout/topbar/navigation.component';
import { SidebarNavigationComponent } from './layout/sidebar/navigation.component';
import { TopbarOptionsComponent } from './layout/topbar/options.component';

import { TooltipComponent } from './components/tooltip/tooltip.component';
import { FooterComponent } from './components/footer/footer.component';
import { InfiniteScroll } from './components/infinite-scroll/infinite-scroll';
import { CountryInputComponent } from './components/forms/country-input/country-input.component';
import { DateInputComponent } from './components/forms/date-input/date-input.component';
import { CityFinderComponent } from './components/forms/city-finder/city-finder.component';
import { StateInputComponent } from './components/forms/state-input/state-input.component';
import { ReadMoreDirective } from './read-more/read-more.directive';
import { ReadMoreButtonComponent } from './read-more/button.component';
import { ChannelBadgesComponent } from './components/badges/badges.component';
import { NSFWSelectorComponent } from './components/nsfw-selector/nsfw-selector.component';
import {
  NSFWSelectorService,
  NSFWSelectorConsumerService,
  NSFWSelectorCreatorService,
  NSFWSelectorEditingService,
} from './components/nsfw-selector/nsfw-selector.service';

import { Scheduler } from './components/scheduler/scheduler';
import { Modal } from './components/modal/modal.component';
import { MindsRichEmbed } from './components/rich-embed/rich-embed';
import { QRCodeComponent } from './components/qr-code/qr-code.component';

import { MDL_DIRECTIVES } from './directives/material';
import { AutoGrow } from './directives/autogrow';
import { InlineAutoGrow } from './directives/inline-autogrow';
import { Emoji } from './directives/emoji';
import { Hovercard } from './directives/hovercard';
import { ScrollLock } from './directives/scroll-lock';
import { TagsLinks } from './directives/tags';
import { Tooltip } from './directives/tooltip';
import { MindsAvatar } from './components/avatar/avatar';
import { CaptchaComponent } from './components/captcha/captcha.component';
import { Textarea } from './components/editors/textarea.component';
import { TagcloudComponent } from './components/tagcloud/tagcloud.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';

import { DynamicHostDirective } from './directives/dynamic-host.directive';
import { MindsCard } from './components/card/card.component';
import { MindsButton } from './components/button/button.component';
import { OverlayModalComponent } from './components/overlay-modal/overlay-modal.component';

import { ChartComponent } from './components/chart/chart.component';
import { DateSelectorComponent } from './components/date-selector/date-selector.component';
import { AdminActionsButtonComponent } from './components/button/admin-actions/admin-actions.component';
import { InlineEditorComponent } from './components/editors/inline-editor.component';
import { AttachmentService } from '../services/attachment';
import { MaterialBoundSwitchComponent } from './components/material/bound-switch.component';
import { IfFeatureDirective } from './directives/if-feature.directive';
import { MindsEmoji } from './components/emoji/emoji';
import { CategoriesSelectorComponent } from './components/categories/selector/selector.component';
import { CategoriesSelectedComponent } from './components/categories/selected/selected.component';
import { TreeComponent } from './components/tree/tree.component';
import { AnnouncementComponent } from './components/announcements/announcement.component';
import { MindsTokenSymbolComponent } from './components/cypto/token-symbol.component';
import { PhoneInputComponent } from './components/phone-input/phone-input.component';
import { PhoneInputCountryComponent } from './components/phone-input/country.component';
import { Session } from '../services/session';
import { Client, Upload } from '../services/api';
import { MindsHttpClient } from './api/client.service';
import { SafeToggleComponent } from './components/safe-toggle/safe-toggle.component';
import { NotificationsToasterComponent } from '../modules/notifications/toaster.component';
import { ThumbsUpButton } from './components/thumbs/thumbs-up.component';
import { ThumbsDownButton } from './components/thumbs/thumbs-down.component';
import { DismissableNoticeComponent } from './components/notice/notice.component';
import { AnalyticsImpressions } from './components/analytics/impressions';
import { LineGraph } from './components/graphs/line-graph';
import { PieGraph } from './components/graphs/pie-graph';
import { GraphSVG } from './components/graphs/svg';
import { GraphPoints } from './components/graphs/points';
import { DynamicFormComponent } from './components/forms/dynamic-form/dynamic-form.component';
import { SortSelectorComponent } from './components/sort-selector/sort-selector.component';

import { UpdateMarkersService } from './services/update-markers.service';
import { SocketsService } from '../services/sockets';
import { Storage } from '../services/storage';
import { HttpClient } from '@angular/common/http';
import { AndroidAppDownloadComponent } from './components/android-app-download-button/button.component';
import { SwitchComponent } from './components/switch/switch.component';
import { V2TopbarComponent } from './layout/v2-topbar/v2-topbar.component';
import { UserMenuComponent } from './layout/v2-topbar/user-menu.component';
import { FeaturedContentComponent } from './components/featured-content/featured-content.component';
import { FeaturedContentService } from './components/featured-content/featured-content.service';
import { BoostedContentService } from './services/boosted-content.service';
import { FeedsService } from './services/feeds.service';
import { EntitiesService } from './services/entities.service';
import { BlockListService } from './services/block-list.service';
import { SettingsService } from '../modules/settings/settings.service';
import { ThemeService } from './services/theme.service';
import { HorizontalInfiniteScroll } from './components/infinite-scroll/horizontal-infinite-scroll.component';
import { ReferralsLinksComponent } from '../modules/wallet/tokens/referrals/links/links.component';
import { PosterDateSelectorComponent } from './components/poster-date-selector/selector.component';
import { ChannelModeSelectorComponent } from './components/channel-mode-selector/channel-mode-selector.component';
import { ShareModalComponent } from '../modules/modals/share/share';
import { RouterHistoryService } from './services/router-history.service';
import { DraggableListComponent } from './components/draggable-list/list.component';
import { DndModule } from 'ngx-drag-drop';
import { SiteService } from './services/site.service';
import { MarketingComponent } from './components/marketing/marketing.component';
import { MarketingFooterComponent } from './components/marketing/footer.component';
import { ToggleComponent } from './components/toggle/toggle.component';
import { MarketingAsFeaturedInComponent } from './components/marketing/as-featured-in.component';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';
import { ChartV2Component } from './components/chart-v2/chart-v2.component';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { ShadowboxLayoutComponent } from './components/shadowbox-layout/shadowbox-layout.component';
import { ShadowboxHeaderComponent } from './components/shadowbox-header/shadowbox-header.component';
import { DropdownSelectorComponent } from './components/dropdown-selector/dropdown-selector.component';
import { ShadowboxSubmitButtonComponent } from './components/shadowbox-submit-button/shadowbox-submit-button.component';
import { FormDescriptorComponent } from './components/form-descriptor/form-descriptor.component';
import { FormToastComponent } from './components/form-toast/form-toast.component';
import { SsoService } from './services/sso.service';
import { EmailConfirmationComponent } from './components/email-confirmation/email-confirmation.component';

PlotlyModule.plotlyjs = PlotlyJS;

const routes: Routes = [
  {
    path: 'email-confirmation',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    DndModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PlotlyModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    MINDS_PIPES,

    TopbarComponent,
    SidebarMarkersComponent,
    TopbarNavigationComponent,
    SidebarNavigationComponent,
    TopbarOptionsComponent,

    // V2 Layout
    V2TopbarComponent,
    UserMenuComponent,

    //

    TooltipComponent,
    FooterComponent,
    InfiniteScroll,
    HorizontalInfiniteScroll,
    CountryInputComponent,
    DateInputComponent,
    StateInputComponent,
    CityFinderComponent,
    Scheduler,
    Modal,
    ReadMoreDirective,
    ReadMoreButtonComponent,
    ChannelBadgesComponent,
    MindsRichEmbed,
    TagcloudComponent,
    DropdownComponent,
    QRCodeComponent,

    AutoGrow,
    InlineAutoGrow,
    Emoji,
    MindsEmoji,
    Hovercard,
    ScrollLock,
    TagsLinks,
    Tooltip,
    MDL_DIRECTIVES,
    DateSelectorComponent,
    MindsAvatar,
    CaptchaComponent,
    Textarea,
    InlineEditorComponent,

    DynamicHostDirective,
    MindsCard,
    MindsButton,

    ChartComponent,
    OverlayModalComponent,

    AdminActionsButtonComponent,

    MaterialBoundSwitchComponent,

    IfFeatureDirective,

    CategoriesSelectorComponent,
    CategoriesSelectedComponent,
    TreeComponent,

    AnnouncementComponent,
    MindsTokenSymbolComponent,
    PhoneInputComponent,
    PhoneInputCountryComponent,
    SafeToggleComponent,
    ThumbsUpButton,
    ThumbsDownButton,
    DismissableNoticeComponent,
    AnalyticsImpressions,
    LineGraph,
    PieGraph,
    GraphSVG,
    GraphPoints,
    DynamicFormComponent,
    AndroidAppDownloadComponent,
    SortSelectorComponent,
    ChannelModeSelectorComponent,
    NSFWSelectorComponent,

    SwitchComponent,

    FeaturedContentComponent,
    PosterDateSelectorComponent,
    DraggableListComponent,
    ToggleComponent,
    MarketingComponent,
    MarketingFooterComponent,
    MarketingAsFeaturedInComponent,
    SidebarMenuComponent,
    ChartV2Component,
    PageLayoutComponent,
    DashboardLayoutComponent,
    ShadowboxLayoutComponent,
    ShadowboxHeaderComponent,
    DropdownSelectorComponent,
    FormDescriptorComponent,
    FormToastComponent,
    ShadowboxSubmitButtonComponent,
    EmailConfirmationComponent,
  ],
  exports: [
    MINDS_PIPES,

    TopbarComponent,
    SidebarNavigationComponent,
    TopbarOptionsComponent,

    // V2 Layout
    V2TopbarComponent,
    UserMenuComponent,

    //

    TooltipComponent,
    FooterComponent,
    InfiniteScroll,
    HorizontalInfiniteScroll,
    CountryInputComponent,
    DateInputComponent,
    CityFinderComponent,
    StateInputComponent,
    Scheduler,
    Modal,
    ReadMoreDirective,
    ReadMoreButtonComponent,
    ChannelBadgesComponent,
    MindsRichEmbed,
    TagcloudComponent,
    DropdownComponent,
    QRCodeComponent,

    AutoGrow,
    InlineAutoGrow,
    MindsEmoji,
    Emoji,
    Hovercard,
    ScrollLock,
    TagsLinks,
    Tooltip,
    MDL_DIRECTIVES,
    DateSelectorComponent,
    MindsAvatar,
    CaptchaComponent,
    Textarea,
    InlineEditorComponent,

    DynamicHostDirective,
    MindsCard,
    MindsButton,

    ChartComponent,
    OverlayModalComponent,

    AdminActionsButtonComponent,

    MaterialBoundSwitchComponent,

    IfFeatureDirective,

    CategoriesSelectorComponent,
    CategoriesSelectedComponent,
    TreeComponent,

    SidebarMarkersComponent,

    AnnouncementComponent,
    MindsTokenSymbolComponent,
    PhoneInputComponent,
    SafeToggleComponent,
    ThumbsUpButton,
    ThumbsDownButton,
    DismissableNoticeComponent,
    AnalyticsImpressions,
    GraphSVG,
    GraphPoints,
    LineGraph,
    PieGraph,
    DynamicFormComponent,
    AndroidAppDownloadComponent,
    SortSelectorComponent,
    SwitchComponent,
    NSFWSelectorComponent,
    FeaturedContentComponent,
    PosterDateSelectorComponent,
    ChannelModeSelectorComponent,
    DraggableListComponent,
    ToggleComponent,
    MarketingComponent,
    MarketingAsFeaturedInComponent,
    SidebarMenuComponent,
    ChartV2Component,
    PageLayoutComponent,
    DashboardLayoutComponent,
    ShadowboxLayoutComponent,
    DropdownSelectorComponent,
    FormDescriptorComponent,
    FormToastComponent,
    ShadowboxSubmitButtonComponent,
    EmailConfirmationComponent,
  ],
  providers: [
    SiteService,
    SsoService,
    {
      provide: AttachmentService,
      useFactory: AttachmentService._,
      deps: [Session, Client, Upload, HttpClient],
    },
    {
      provide: UpdateMarkersService,
      useFactory: (_http, _session, _sockets) => {
        return new UpdateMarkersService(_http, _session, _sockets);
      },
      deps: [MindsHttpClient, Session, SocketsService],
    },
    {
      provide: MindsHttpClient,
      useFactory: MindsHttpClient._,
      deps: [HttpClient],
    },
    {
      provide: NSFWSelectorCreatorService,
      useFactory: _storage => new NSFWSelectorCreatorService(_storage),
      deps: [Storage],
    },
    {
      provide: NSFWSelectorConsumerService,
      useFactory: _storage => new NSFWSelectorConsumerService(_storage),
      deps: [Storage],
    },
    {
      provide: BoostedContentService,
      useFactory: (
        client,
        session,
        entitiesService,
        blockListService,
        settingsService
      ) =>
        new BoostedContentService(
          client,
          session,
          entitiesService,
          blockListService,
          settingsService
        ),
      deps: [
        Client,
        Session,
        EntitiesService,
        BlockListService,
        SettingsService,
      ],
    },
    {
      provide: FeaturedContentService,
      useFactory: boostedContentService =>
        new FeaturedContentService(boostedContentService),
      deps: [FeedsService],
    },
    {
      provide: RouterHistoryService,
      useFactory: router => new RouterHistoryService(router),
      deps: [Router],
    },
  ],
  entryComponents: [
    NotificationsToasterComponent,
    ReferralsLinksComponent,
    ShareModalComponent,
  ],
})
export class CommonModule {}
