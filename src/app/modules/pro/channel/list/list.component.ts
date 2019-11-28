import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FeedsService } from '../../../../common/services/feeds.service';
import {
  NavItems,
  ProChannelService,
  RouterLinkToType,
} from '../channel.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { MindsTitle } from '../../../../services/ux/title';
import { filter } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Component({
  selector: 'm-pro--channel-list',
  templateUrl: 'list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FeedsService],
})
export class ProChannelListComponent implements OnInit, OnDestroy {
  paramsType: string; // exact string that came from the router params

  type: string;

  params$: Subscription;

  entities: any[] = [];

  query: string;

  period: string;

  selectedHashtag: string = 'all';

  entities$;

  constructor(
    public feedsService: FeedsService,
    protected modalService: OverlayModalService,
    protected channelService: ProChannelService,
    protected title: MindsTitle,
    protected route: ActivatedRoute,
    protected router: Router,
    protected cd: ChangeDetectorRef,
    protected injector: Injector
  ) {
    this.entities$ = this.feedsService.feed.pipe(
      map((elements: BehaviorSubject<any>[]) => {
        return elements.filter((element: BehaviorSubject<any>) => {
          const entity = element.getValue();
          return (
            entity.type === 'group' ||
            !!entity.thumbnail_src ||
            !!entity.custom_data ||
            (entity.thumbnails && entity.thumbnails.length > 0)
          );
        });
      })
    );
  }

  ngOnInit() {
    this.params$ = this.route.params.subscribe(params => {
      this.entities = [];
      if (params['type']) {
        this.type = this.paramsType = params['type'];
      }
      switch (params['type']) {
        case 'all':
          this.type = 'all';
          break;
        case 'videos':
          this.type = 'videos';
          break;
        case 'images':
          this.type = 'images';
          break;
        case 'articles':
          this.type = 'blogs';
          break;
        case 'groups':
          this.type = 'groups';
          break;
        case 'feed':
          this.type = 'activities';
          break;
        default:
          throw new Error('Unknown type');
      }

      this.query = params['query'] || '';
      this.period = params['period'] || '';
      this.selectedHashtag = params['hashtag'] || 'all';

      this.setTitle();

      this.load(true);
      this.setMenuNavItems();
    });
  }

  ngOnDestroy() {
    if (this.params$) {
      this.params$.unsubscribe();
    }

    this.channelService.destroyMenuNavItems();
  }

  setTitle() {
    if (!this.channelService.currentChannel) {
      this.title.setTitle(
        this.channelService.currentChannel.username || 'Minds Pro',
        false
      );
      return;
    }

    this.title.setTitle(this.type.charAt(0).toUpperCase() + this.type.slice(1));
  }

  async load(refresh: boolean = false) {
    if (refresh) {
      this.feedsService.clear();
    }

    this.detectChanges();

    let params: any = {};

    if (this.selectedHashtag && this.selectedHashtag !== 'all') {
      params.hashtags = this.selectedHashtag;
    }

    if (this.query && this.query !== '') {
      params.period = this.period;
      params.all = 1;
      params.query = this.query;
      params.sync = 1;
    }

    let url = `api/v2/pro/content/${this.channelService.currentChannel.guid}/${this.type}`;

    try {
      this.feedsService
        .setEndpoint(url)
        .setParams(params)
        .setCastToActivities(false)
        .setLimit(12)
        .fetch();
    } catch (e) {
      console.error('ProChannelListComponent.load', e);
    }
  }

  setMenuNavItems() {
    const tags = this.channelService.currentChannel.pro_settings.tag_list.concat(
      []
    );

    tags.unshift({ label: 'All', tag: 'all', selected: false });

    const navItems: Array<NavItems> = tags.map(tag => ({
      label: tag.label,
      onClick: () => {
        this.selectHashtag(tag.tag);
      },
      isActive: () => {
        return this.selectedHashtag === tag.tag;
      },
    }));

    this.channelService.pushMenuNavItems(navItems, true);
  }

  get hasMore$() {
    return this.feedsService.hasMore;
  }

  get inProgress$() {
    return this.feedsService.inProgress;
  }

  loadMore() {
    this.feedsService.loadMore();
  }

  onTileClicked(entity: any) {
    return this.channelService.open(entity, this.modalService);
  }

  selectHashtag(tag: string) {
    let params;

    if (tag) {
      params = { hashtag: tag };
    }

    return this.router.navigate(
      this.channelService.getRouterLink(
        this.paramsType as RouterLinkToType,
        params
      )
    );
  }

  get shouldShowCategories() {
    return (
      this.paramsType !== 'groups' && this.paramsType !== 'feed' && !this.query
    );
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
