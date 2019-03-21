import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Session } from '../../../services/session';
import { ContextService } from '../../../services/context.service';
import { EntitiesService } from "../../../common/services/entities.service";
import { Client } from "../../../services/api/client";
import { FeaturesService } from "../../../services/features.service";

@Component({
  selector: 'm-newsfeed--single',
  templateUrl: 'single.component.html'
})

export class NewsfeedSingleComponent {

  minds = window.Minds;
  inProgress: boolean = false;
  activity: any;
  error: string = '';
  paramsSubscription: Subscription;
  queryParamsSubscription: Subscription;
  focusedCommentGuid: string = '';

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public context: ContextService,
    public session: Session,
    public entitiesService: EntitiesService,
    protected client: Client,
    protected featuresService: FeaturesService,
  ) {
  }

  ngOnInit() {
    this.context.set('activity');

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['guid']) {
        this.error = '';
        this.activity = void 0;
        if (this.route.snapshot.queryParamMap.has('comment_guid')) {
          this.focusedCommentGuid = this.route.snapshot.queryParamMap.get('comment_guid');
        }
        this.load(params['guid']);
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  /**
   * Load newsfeed
   */
  load(guid: string) {
    this.context.set('activity');

    const fetchSingleGuid = this.featuresService.has('sync-feeds') ?
      this.loadFromFeedsService(guid) :
      this.loadLegacy(guid);

    fetchSingleGuid.then((activity: any) => {
      this.activity = activity;

      switch (this.activity.subtype) {
        case 'image':
        case 'video':
        case 'album':
          this.router.navigate(['/media', this.activity.guid], { replaceUrl: true });
          break;
        case 'blog':
          this.router.navigate(['/blog/view', this.activity.guid], { replaceUrl: true });
          break;
      }

      if (this.activity.ownerObj) {
        this.context.set('activity', {
          label: `@${this.activity.ownerObj.username} posts`,
          nameLabel: `@${this.activity.ownerObj.username}`,
          id: this.activity.ownerObj.guid
        });
      } else if (this.activity.owner_guid) {
        this.context.set('activity', {
          label: `this user's posts`,
          id: this.activity.owner_guid
        });
      } else {
        this.context.reset();
      }
    })
      .catch(e => {
        if (e.status === 0) {
          this.error = 'Sorry, there was a timeout error.';
        } else {
          this.error = 'Sorry, we couldn\'t load the activity';
        }
        this.inProgress = false;
      });
  }

  async loadFromFeedsService(guid: string) {
    return await this.entitiesService.single(guid);
  }

  async loadLegacy(guid: string) {
    return (<any>await this.client.get('api/v1/newsfeed/single/' + guid, {}, { cache: true })).activity;
  }

  delete(activity) {
    this.router.navigate(['/newsfeed']);
  }
}
