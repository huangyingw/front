import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NavItems, ProChannelService } from '../channel.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { MindsTitle } from '../../../../services/ux/title';

@Component({
  selector: 'm-pro--channel-home',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: 'home.component.html',
})
export class ProChannelHomeComponent implements OnInit, OnDestroy {
  inProgress: boolean = false;

  featuredContent: Array<any> = [];

  categories: Array<{
    tag: { tag: string; label: string };
    content: Array<Observable<any>>;
  }> = [];

  moreData: boolean = true;

  constructor(
    protected router: Router,
    protected channelService: ProChannelService,
    protected modalService: OverlayModalService,
    protected title: MindsTitle,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
    this.setMenuNavItems();
    this.setTitle();
  }

  ngOnDestroy() {
    this.channelService.destroyMenuNavItems();
  }

  async load() {
    const MAX_FEATURED_CONTENT = 17; // 1 + (8 * 2)

    this.inProgress = true;
    this.featuredContent = [];
    this.categories = [];
    this.moreData = true;

    this.detectChanges();

    try {
      this.featuredContent = await this.channelService.getFeaturedContent();
      this.detectChanges();

      const { content } = await this.channelService.getContent({
        limit: MAX_FEATURED_CONTENT,
      });
      this.featuredContent = this.featuredContent
        .concat(content)
        .slice(0, MAX_FEATURED_CONTENT);
      this.detectChanges();

      this.categories = await this.channelService.getAllCategoriesContent();
      this.detectChanges();
    } catch (e) {
      this.moreData = false;
    }

    this.inProgress = false;
    this.detectChanges();
  }

  setMenuNavItems() {
    const tags = this.channelService.currentChannel.pro_settings.tag_list.concat(
      []
    );
    const navItems: Array<NavItems> = tags.map(tag => ({
      label: tag.label,
      onClick: () => {
        this.navigateToCategory(tag.tag);
      },
      isActive: () => {
        return false;
      },
    }));

    this.channelService.pushMenuNavItems(navItems, true);
  }

  setTitle() {
    this.title.setTitle('Home');
  }

  getCategoryRoute(tag) {
    if (!this.channelService.currentChannel || !tag) {
      return [];
    }

    return this.channelService.getRouterLink('all', { hashtag: tag });
  }

  onContentClick(entity: any) {
    return this.channelService.open(entity, this.modalService);
  }

  navigateToCategory(tag) {
    this.router.navigate(
      this.channelService.getRouterLink('all', { hashtag: tag })
    );
  }

  get settings() {
    return (
      this.channelService.currentChannel &&
      this.channelService.currentChannel.pro_settings
    );
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
