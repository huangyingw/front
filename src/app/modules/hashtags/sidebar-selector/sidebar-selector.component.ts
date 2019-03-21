import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { TopbarHashtagsService } from "../service/topbar.service";
import { Tag } from "../types/tag";
import { findLastIndex } from "../../../utils/array-utils";

export type SideBarSelectorChange = { type: string, value?: any };

@Component({
  selector: 'm-hashtags--sidebar-selector',
  templateUrl: 'sidebar-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarSelectorComponent implements OnInit {

  @Input() compact: boolean = false;
  @Input() disabled: boolean;
  @Input() preferred: boolean = true;
  @Input() showAtLeast: number = 5;
  @Input() currentHashtag: string;
  @Output() filterChange: EventEmitter<SideBarSelectorChange> = new EventEmitter<SideBarSelectorChange>();
  @Output() switchAttempt: EventEmitter<any> = new EventEmitter<any>();

  initialized: boolean = false;
  hashtags: Tag[] = [];
  showAll: boolean = true;
  loading: boolean;
  showExtendedList: boolean = false;
  showTrending: boolean = false;

  protected lastPreferredEmission: boolean;

  constructor(
    protected topbarHashtagsService: TopbarHashtagsService,
    protected changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.lastPreferredEmission = this.preferred;
    this.init();
  }

  async init() {
    await this.load();

    this.initialized = true;
    this.detectChanges();
  }

  async load() {
    this.loading = true;
    this.detectChanges();

    try {
      this.hashtags = await this.topbarHashtagsService.loadAll({
        softLimit: 25,
        trending: this.showTrending,
        defaults: !this.showTrending,
      });
    } catch (e) {
      console.error('SidebarSelector', e);
    }

    this.loading = false;
    this.detectChanges();
  }

  calcFoldLength() {
    // Ensure user hashtags are always shown; checks the first non-user and uses index as size
    const userLength = findLastIndex(this.hashtags, hashtag => hashtag.type === 'user');

    // Ensure selected hashtags are always shown; checks the first non-selected and uses index + 10
    const selectedLength = findLastIndex(this.hashtags, hashtag => hashtag.selected) + 10;

    // Ensure current hashtag position is always shown; uses index + 1 as size; only when not disabled
    const currentSelectedLength = !this.disabled ?
      this.hashtags.findIndex(hashtag => hashtag.value === this.currentHashtag) + 1 :
      -1;

    // Return the largest
    return Math.max(this.showAtLeast, userLength, selectedLength, currentSelectedLength);
  }

  get visibleHashtags() {
    if (!this.showAll) {
      return this.hashtags.slice(0, this.calcFoldLength());
    }

    return this.hashtags;
  }

  get hasBelowTheFoldHashtags() {
    return this.hashtags.length > this.calcFoldLength();
  }

  hashtagVisibilityChange(hashtag) {
    if (this.currentHashtag !== hashtag.value) {
      this.currentHashtag = hashtag.value;

      this.filterChange.emit({
        type: 'single',
        value: this.currentHashtag,
      });
    } else {
      this.currentHashtag = null;
      this.preferred = this.lastPreferredEmission;

      this.preferredChange();
    }
  }

  preferredChange() {
    this.lastPreferredEmission = this.preferred;

    this.filterChange.emit({
      type: this.preferred ? 'preferred' : 'all'
    });
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  addHashtag(htmlInputElement: HTMLInputElement) {
    const hashtagValue = htmlInputElement.value;

    this.resetAddHashtag(htmlInputElement);
    this.detectChanges();

    if (hashtagValue) {
      let hashtag: Tag = {
        value: this.topbarHashtagsService.cleanupHashtag(hashtagValue.toLowerCase()),
        selected: false,
      };

      this.hashtags.push(hashtag);
      this.detectChanges();

      this.toggleHashtag(hashtag);
    }
  }

  resetAddHashtag(htmlInputElement: HTMLInputElement) {
    htmlInputElement.value = '';
  }

  async toggleHashtag(hashtag) {
    try {
      await this.topbarHashtagsService.toggleSelection(hashtag, this);
    } catch (e) {
      console.error('SidebarSelector', e);
      hashtag.selected = !hashtag.selected;
    }

    this.detectChanges();

    this.preferredChange();
  }

  toggleShowExtendedList() {
    this.showExtendedList = !this.showExtendedList;
  }

  closeExtendedList() {
    this.showExtendedList = false;
  }

  toggleTrending() {
    this.showTrending = !this.showTrending;
    this.hashtags = [];

    this.load();
  }

  detectChanges() {
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }
}
