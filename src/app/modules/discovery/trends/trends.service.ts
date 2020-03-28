import { Injectable } from '@angular/core';
import { Client } from '../../../services/api';
import { BehaviorSubject } from 'rxjs';

export type DiscoveryTrend = any;

@Injectable()
export class DiscoveryTrendsService {
  trends$: BehaviorSubject<DiscoveryTrend[]> = new BehaviorSubject([]);
  hero$: BehaviorSubject<DiscoveryTrend> = new BehaviorSubject(null);
  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private client: Client) {}

  async loadTrends() {
    this.inProgress$.next(true);
    this.trends$.next([]);
    this.hero$.next(null);
    const response: any = await this.client.get('api/v3/discovery/trends');
    this.inProgress$.next(false);
    this.trends$.next(response.trends);
    this.hero$.next(response.hero);
  }
}
