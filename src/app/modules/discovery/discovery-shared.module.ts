import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { DiscoveryTagsService } from './tags/tags.service';
import { DiscoverySidebarTagsComponent } from './tags/sidebar-tags.component';
import { DiscoveryTagSettingsComponent } from './tags/settings.component';
import { DiscoveryFeedsSettingsComponent } from './feeds/settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DiscoveryFeedItemComponent } from './feeds/feed-item.component';
import { LegacyModule } from '../legacy/legacy.module';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { DiscoveryService } from './discovery.service';
import { DiscoveryTagButtonComponent } from './tags/tag-button/tag-button.component';
import { DiscoveryTagWidgetComponent } from './tags/tag-widget/tag-widget.component';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    LegacyModule,
    ActivityModule,
  ],
  declarations: [
    DiscoverySidebarTagsComponent,
    DiscoveryTagSettingsComponent,
    DiscoveryFeedsSettingsComponent,
    DiscoveryFeedItemComponent,
    DiscoveryTagButtonComponent,
    DiscoveryTagWidgetComponent,
  ],
  exports: [
    DiscoverySidebarTagsComponent,
    DiscoveryTagSettingsComponent,
    DiscoveryFeedItemComponent,
    DiscoveryTagButtonComponent,
    DiscoveryTagWidgetComponent,
  ],
  providers: [DiscoveryTagsService, DiscoveryService],
})
export class DiscoverySharedModule {}
