import { Injectable, OnDestroy } from '@angular/core';
import { MindsChannelResponse } from '../../../interfaces/responses';
import { MindsUser } from '../../../interfaces/entities';
import { Client } from '../../../services/api/client';
import { EntitiesService } from '../../../common/services/entities.service';
import normalizeUrn from '../../../helpers/normalize-urn';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Session } from '../../../services/session';
import { ActivatedRoute, Router } from '@angular/router';
import { WireCreatorComponent } from '../../wire/creator/creator.component';
import { SessionsStorageService } from '../../../services/session-storage.service';
import { SiteService } from '../../../common/services/site.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AnalyticsService } from '../../../services/analytics';

export type RouterLinkToType =
  | 'home'
  | 'all'
  | 'feed'
  | 'videos'
  | 'images'
  | 'articles'
  | 'groups'
  | 'donate'
  | 'login';

export interface NavItems {
  label: string;
  onClick: () => void;
  isActive: () => boolean;
}

type PaginationParams = { limit?: number; offset?: any };
type FeedsResponse = {
  content: Array<any>;
  offset: any;
};

@Injectable()
export class ProChannelService implements OnDestroy {
  currentChannel: MindsUser;

  readonly onChannelChange: BehaviorSubject<any> = new BehaviorSubject(null);

  protected featuredContent: Array<any> | null;

  protected menuNavItems: Array<NavItems> = [];

  protected isLoggedIn$: Subscription;

  constructor(
    protected client: Client,
    protected entitiesService: EntitiesService,
    protected session: Session,
    protected route: ActivatedRoute,
    protected modalService: OverlayModalService,
    protected sessionStorage: SessionsStorageService,
    protected router: Router,
    protected site: SiteService,
    protected analytics: AnalyticsService
  ) {
    this.listen();
  }

  listen() {
    this.isLoggedIn$ = this.session.loggedinEmitter.subscribe(is => {
      if (!is && this.currentChannel) {
        this.currentChannel.subscribed = false;
      }
    });
  }

  ngOnDestroy() {
    this.isLoggedIn$.unsubscribe();
  }

  async load(id: string): Promise<MindsUser> {
    try {
      this.currentChannel = void 0;

      const response = (await this.client.get(`api/v2/pro/channel/${id}`)) as {
        channel;
      };

      this.currentChannel = response.channel;

      if (!this.currentChannel.pro_settings.tag_list) {
        this.currentChannel.pro_settings.tag_list = [];
      }

      this.onChannelChange.next(this.currentChannel);

      this.featuredContent = null;

      return this.currentChannel;
    } catch (e) {
      if (e.status === 0) {
        throw new Error('Connectivity error. Are you offline?');
      } else {
        throw new Error(e.message || 'There was an issue loading this channel');
      }
    }
  }

  async reload(id: string) {
    try {
      const response = (await this.client.get(`api/v2/pro/channel/${id}`)) as {
        channel;
      };

      this.currentChannel = response.channel;
      this.onChannelChange.next(this.currentChannel);

      return this.currentChannel;
    } catch (e) {
      if (e.status === 0) {
        throw new Error('Network error');
      } else {
        throw new Error('Error loading channel');
      }
    }
  }

  async getFeaturedContent(): Promise<Array<any>> {
    if (!this.currentChannel) {
      throw new Error('No channel');
    }

    if (!this.featuredContent) {
      if (
        this.currentChannel.pro_settings.featured_content &&
        this.currentChannel.pro_settings.featured_content.length
      ) {
        try {
          const urns = this.currentChannel.pro_settings.featured_content.map(
            guid => normalizeUrn(guid)
          );
          const { entities } = (await this.entitiesService.fetch(urns)) as any;

          this.featuredContent = entities.filter(
            entity => !!entity.thumbnail_src
          );
        } catch (e) {
          this.featuredContent = null;
          return [];
        }
      } else {
        this.featuredContent = [];
      }
    }

    return this.featuredContent;
  }

  async getContent(params: PaginationParams = {}): Promise<FeedsResponse> {
    if (!this.currentChannel) {
      throw new Error('No channel');
    }

    const endpoint = `api/v2/pro/content/${this.currentChannel.guid}/all`;
    const qs = {
      limit: params.limit || 24,
      from_timestamp: params.offset || '',
      sync: 1,
      exclude:
        (this.currentChannel.pro_settings.featured_content || []).join(',') ||
        '',
      cache: true,
    };

    const {
      entities: feedSyncEntities,
      'load-next': loadNext,
    } = (await this.client.get(endpoint, qs)) as any;
    const { entities } = (await this.entitiesService.fetch(
      feedSyncEntities.map(feedSyncEntity => normalizeUrn(feedSyncEntity.guid))
    )) as any;

    let nextOffset =
      feedSyncEntities && feedSyncEntities.length ? loadNext : '';

    return {
      content: entities,
      offset: nextOffset,
    };
  }

  async getAllCategoriesContent() {
    if (!this.currentChannel) {
      throw new Error('No channel');
    }

    const { content } = (await this.client.get(
      `api/v2/pro/channel/${this.currentChannel.guid}/content`
    )) as any;

    return content
      .filter(entry => entry && entry.content && entry.content.length)
      .map(entry => {
        entry.content = entry.content.map(item => {
          if (item.entity) {
            return Promise.resolve(item.entity);
          }

          return this.entitiesService.single(item.urn);
        });

        return entry;
      });
  }

  getRouterLink(to: RouterLinkToType, params?: { [key: string]: any }): any[] {
    let root = '/';

    if (this.route.parent) {
      root = this.route.parent.pathFromRoot
        .map(route =>
          route.snapshot.url.map(urlSegment => urlSegment.toString()).join('')
        )
        .join('/');
    }

    const route: any[] = [root];

    if (!this.site.isProDomain) {
      route.push(this.currentChannel.username);
    }

    switch (to) {
      case 'home':
        /* Root */
        break;

      case 'all':
      case 'feed':
      case 'videos':
      case 'images':
      case 'articles':
      case 'groups':
        route.push(to);

        if (params) {
          route.push(params);
        }
        break;

      case 'donate':
        route.push(to);
        break;

      case 'login':
        route.push('login');
        break;
    }

    return route;
  }

  open(entity, modalServiceContext: OverlayModalService) {
    switch (this.getEntityTaxonomy(entity)) {
      case 'group':
        window.open(
          `${window.Minds.site_url}groups/profile/${entity.guid}`,
          '_blank'
        );
        break;
    }
  }

  getEntityTaxonomy(entity) {
    return entity.type === 'object'
      ? `${entity.type}:${entity.subtype}`
      : entity.type;
  }

  async subscribe() {
    this.currentChannel.subscribed = true;
    this.currentChannel.subscribers_count += 1;

    try {
      const response = (await this.client.post(
        'api/v1/subscribe/' + this.currentChannel.guid
      )) as any;

      if (!response || response.error) {
        throw new Error(response.error || 'Invalid server response');
      }
    } catch (e) {
      this.currentChannel.subscribed = false;
      this.currentChannel.subscribers_count -= 1;
    }
  }

  async unsubscribe() {
    this.currentChannel.subscribed = false;
    this.currentChannel.subscribers_count -= 1;

    try {
      const response = (await this.client.delete(
        'api/v1/subscribe/' + this.currentChannel.guid
      )) as any;

      if (!response || response.error) {
        throw new Error(response.error || 'Invalid server response');
      }
    } catch (e) {
      this.currentChannel.subscribed = true;
      this.currentChannel.subscribers_count += 1;
    }
  }

  wire() {
    // save into sessionStorage before doing the logged in check so the modal opens after logging in
    this.sessionStorage.set('pro::wire-modal::open', '1');

    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.session.getLoggedInUser().guid == this.currentChannel.guid) {
      return;
    }

    this.modalService
      .create(WireCreatorComponent, this.currentChannel, {
        onComplete: () => {
          this.sessionStorage.destroy('pro::wire-modal::open');
        },
      })
      .onDidDismiss(() => {
        this.sessionStorage.destroy('pro::wire-modal::open');
      })
      .present();

    this.analytics.send('pageview', {
      url: `/pro/${this.currentChannel.guid}/wire?ismodal=true`,
    });
  }

  pushMenuNavItems(navItems: Array<NavItems>, clean?: boolean) {
    if (clean) {
      this.destroyMenuNavItems();
    }

    this.menuNavItems = this.menuNavItems.concat(navItems);
    return this;
  }

  destroyMenuNavItems() {
    this.menuNavItems = [];
    return this;
  }

  getMenuNavItems(): Array<NavItems> {
    return this.menuNavItems;
  }
}
