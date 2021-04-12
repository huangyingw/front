import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  last,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { FriendlyDateDiffPipe } from '../../../../../common/pipes/friendlydatediff';
import { ActivityEntity } from '../../activity.service';

/**
 * Shows relative time ago in a span element e.g. 30s ago
 * Time will only update when the host is on screen.
 */
@Component({
  selector: 'm-relativeTimeSpan',
  template: `
    <span
      class="m-relativeTime__span"
      [title]="entity.time_created * 1000 | date: 'medium'"
      #relativeTimeSpan
    >
      {{ pauseableRelativeTimeAgo$ | async }}
    </span>
  `,
  styleUrls: ['./relative-time-span.component.ng.scss'],
  providers: [FriendlyDateDiffPipe],
})
export class ActivityRelativeTimeSpanComponent {
  // activity entity to get time from.
  @Input('entity') entity: ActivityEntity;

  // Reference to hosts span element.
  @ViewChild('relativeTimeSpan') relativeTimeSpan: ElementRef;

  /**
   * Relative time ago - e.g. 42 seconds ago.
   * Emits every second.
   */
  private relativeTimeAgo$: Observable<string> = interval(1000).pipe(
    // first emission before first interval
    startWith(0),
    // map through date transform pipe programmatically.
    map(() => this.datePipe.transform(this.entity.time_created * 1000)),
    distinctUntilChanged()
  );

  // set an initial value for the pauseable timer to match relativeTimeAgo$.
  public pauseableRelativeTimeAgo$: Observable<any> = this.relativeTimeAgo$;

  // holds true if span component is being intersected.
  private readonly isIntersecting$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  // intersection observer to monitor intersection with viewport.
  private interceptionObserver: IntersectionObserver;

  constructor(public datePipe: FriendlyDateDiffPipe) {}

  ngAfterViewInit(): void {
    this.setupInterceptionObserver();
    this.setupPauseableRelativeTime();
    // this.pauseableRelativeTimeAgo$.subscribe(val => {console.log("val", val)})
  }

  /**
   * Pauseable wrapper around relativeTime.
   * @returns { void }
   */
  setupPauseableRelativeTime(): void {
    this.pauseableRelativeTimeAgo$ = this.isIntersecting$.pipe(
      // Minor debouncing to catch rapid scrolls
      debounceTime(100),
      // If not intersecting, output last emitted value, else, output live observable.
      switchMap(value =>
        !value ? this.relativeTimeAgo$.pipe(last()) : this.relativeTimeAgo$
      )
    );
  }

  /**
   * Setup an interception observer to report when
   * relativeTime span element enters the DOM and update local
   * isIntersecting$ state accordingly.
   * @returns { void }
   */
  setupInterceptionObserver(): void {
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    this.interceptionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          this.isIntersecting$.next(entry.isIntersecting);
        });
      },
      options
    );

    this.interceptionObserver.observe(this.relativeTimeSpan.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.interceptionObserver) {
      this.interceptionObserver.disconnect();
    }
  }
}
