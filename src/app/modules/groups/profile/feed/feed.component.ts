import { Component, OnDestroy, OnInit } from '@angular/core';
import { GroupsService } from '../../groups.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'm-group-profile__feed',
  templateUrl: 'feed.component.html',
})
export class GroupProfileFeedComponent implements OnInit, OnDestroy {
  group: any;
  type: string = 'activities';

  group$: Subscription;
  param$: Subscription;

  constructor(
    protected service: GroupsService,
    protected route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.group$ = this.service.$group.subscribe(group => {
      this.group = group;
    });

    this.param$ = this.route.params.subscribe(params => {
      this.type = params['filter'] || 'activities';
    });
  }

  ngOnDestroy() {
    if (this.group$) {
      this.group$.unsubscribe();
    }

    if (this.param$) {
      this.param$.unsubscribe();
    }
  }
}
