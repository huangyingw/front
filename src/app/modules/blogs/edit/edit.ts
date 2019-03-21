import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { MindsTitle } from '../../../services/ux/title';
import { ACCESS, LICENSES } from '../../../services/list-options';
import { Client, Upload } from '../../../services/api';
import { Session } from '../../../services/session';
import { InlineEditorComponent } from '../../../common/components/editors/inline-editor.component';
import { WireThresholdInputComponent } from '../../wire/threshold-input/threshold-input.component';
import { HashtagsSelectorComponent } from '../../hashtags/selector/selector.component';
import { Tag } from '../../hashtags/types/tag';
import { InMemoryStorageService } from "../../../services/in-memory-storage.service";

@Component({
  moduleId: module.id,
  selector: 'minds-blog-edit',
  host: {
    'class': 'm-blog'
  },
  templateUrl: 'edit.html'
})

export class BlogEdit {

  minds = window.Minds;

  guid: string;
  blog: any = {
    guid: 'new',
    title: '',
    description: '<p><br></p>',
    time_created: Date.now(),
    access_id: 2,
    tags: [],
    license: 'attribution-sharealike-cc',
    fileKey: 'header',
    mature: 0,
    monetized: 0,
    published: 0,
    wire_threshold: null,
    custom_meta: {
      title: '',
      description: '',
      author: ''
    },
    slug: ''
  };
  banner: any;
  banner_top: number = 0;
  banner_prompt: boolean = false;
  editing: boolean = true;
  canSave: boolean = true;
  inProgress: boolean = false;
  validThreshold: boolean = true;
  error: string = '';
  pendingUploads: string[] = [];
  categories: { id, label, selected }[];

  licenses = LICENSES;
  access = ACCESS;

  paramsSubscription: Subscription;
  @ViewChild('inlineEditor') inlineEditor: InlineEditorComponent;
  @ViewChild('thresholdInput') thresholdInput: WireThresholdInputComponent;
  @ViewChild('hashtagsSelector') hashtagsSelector: HashtagsSelectorComponent;

  constructor(
    public session: Session,
    public client: Client,
    public upload: Upload,
    public router: Router,
    public route: ActivatedRoute,
    public title: MindsTitle,
    protected inMemoryStorageService: InMemoryStorageService
  ) {
    this.getCategories();

    window.addEventListener('attachment-preview-loaded', (event: CustomEvent) => {
      this.pendingUploads.push(event.detail.timestamp);
    });
    window.addEventListener('attachment-upload-finished', (event: CustomEvent) => {
      this.pendingUploads.splice(this.pendingUploads.findIndex((value) => {
        return value === event.detail.timestamp;
      }), 1);
    });
  }

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.title.setTitle('New Blog');

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['guid']) {
        this.guid = params['guid'];

        this.blog = {
          guid: 'new',
          title: '',
          description: '<p><br></p>',
          access_id: 2,
          category: '',
          license: '',
          fileKey: 'header',
          mature: 0,
          monetized: 0,
          published: 0,
          wire_threshold: null,
          custom_meta: {
            title: '',
            description: '',
            author: ''
          },
          slug: '',
          tags: [],
        };

        this.banner = void 0;
        this.banner_top = 0;
        this.banner_prompt = false;
        this.editing = true;
        this.canSave = true;

        if (this.guid !== 'new') {
          this.load();
        } else {
          const description: string = this.inMemoryStorageService.once('newBlogContent');

          if (description) {
            let htmlDescription = description
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/\n+/g, '</p><p>');

            this.blog.description = `<p>${htmlDescription}</p>`;
          }
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  getCategories() {
    this.categories = [];

    for (let category in window.Minds.categories) {
      this.categories.push({
        id: category,
        label: window.Minds.categories[category],
        selected: false
      });
    }

    this.categories.sort((a, b) => a.label > b.label ? 1: -1);
  }

  load() {
    this.client.get('api/v1/blog/' + this.guid, {})
      .then((response: any) => {
        if (response.blog) {
          this.blog = response.blog;
          this.guid = response.blog.guid;
          this.title.setTitle(this.blog.title);

          //this.hashtagsSelector.setTags(this.blog.tags);
          // draft
          if (!this.blog.published && response.blog.draft_access_id) {
            this.blog.access_id = response.blog.draft_access_id;
          }

          if (!this.blog.category)
            this.blog.category = '';

          if (!this.blog.license)
            this.blog.license = '';
        }
      });
  }

  onTagsChange(tags: string[]) {
    this.blog.tags = tags;
  }

  onTagsAdded(tags: Tag[]) {
  }

  onTagsRemoved(tags: Tag[]) {
  }

  validate() {
    this.error = '';

    if (!this.blog.description) {
      this.error = 'error:no-description';
      return false;
    }
    if (!this.blog.title) {
      this.error = 'error:no-title';
      return false;
    }

    return true;
  }

  save() {
    if (!this.canSave)
      return;

    if (!this.validate())
      return;

    this.inlineEditor.prepareForSave().then(() => {
      const blog = Object.assign({}, this.blog);

      // only allowed props
      blog.mature = blog.mature ? 1: 0;
      blog.monetization = blog.monetization ? 1: 0;
      blog.monetized = blog.monetized ? 1: 0;
      this.inProgress = true;
      this.canSave = false;
      this.check_for_banner().then(() => {
        this.upload.post('api/v1/blog/' + this.guid, [this.banner], blog)
          .then((response: any) => {
            this.router.navigate(response.route ? ['/' + response.route]: ['/blog/view', response.guid]);
            this.canSave = true;
            this.inProgress = false;
          })
          .catch((e) => {
            this.canSave = true;
            this.inProgress = false;
          });
      })
        .catch(() => {
          this.error = 'error:no-banner';
          this.inProgress = false;
          this.canSave = true;
        });
    })
  }

  add_banner(banner: any) {
    this.banner = banner.file;
    this.blog.header_top = banner.top;
  }

  //this is a nasty hack because people don't want to click save on a banner ;@
  check_for_banner() {
    if (!this.banner)
      this.banner_prompt = true;

    return new Promise((resolve, reject) => {
      if (this.banner)
        return resolve(true);
      setTimeout(() => {
        this.banner_prompt = false;

        if (this.banner)
          return resolve(true);
        else
          return reject(false);
      }, 100);
    });
  }

  toggleMonetized() {
    if (this.blog.mature) {
      return;
    }

    this.blog.monetized = this.blog.monetized ? 0: 1;
  }

  checkMonetized() {
    if (this.blog.mature) {
      this.blog.monetized = 0;
    }
  }

  onCategoryClick(category) {
    category.selected = !category.selected;
    if (!this.blog.hasOwnProperty('categories') || !this.blog.categories) {
      this.blog['categories'] = [];
    }

    if (category.selected) {
      this.blog.categories.push(category.id);
    } else {
      this.blog.categories.splice(this.blog.categories.indexOf(category.id), 1);
    }
  }
}
