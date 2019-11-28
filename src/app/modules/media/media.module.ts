import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
import { ModalsModule } from '../modals/modals.module';
import { MindsFormsModule } from '../forms/forms.module';
import { CanDeactivateGuardService } from '../../services/can-deactivate-guard';
import { WireModule } from '../wire/wire.module';
import { PostMenuModule } from '../../common/components/post-menu/post-menu.module';
import { VideoModule } from './components/video/video.module';

import { MediaVideosListComponent } from './videos/list.component';
import { MediaVideosTileComponent } from './videos/tile.component';
import { MediaImagesListComponent } from './images/list.component';
import { MediaImagesTileComponent } from './images/tile.component';
import { MediaViewComponent } from './view/view.component';
import { MediaEditComponent } from './edit/edit.component';
import { MediaTheatreComponent } from './view/views/theatre.component';
import { MediaGridComponent } from './view/views/grid.component';
import { MediaViewRecommendedComponent } from './view/recommended/recommended.component';
import { MediaModalComponent } from './modal/modal.component';
import { ThumbnailSelectorComponent } from './components/thumbnail-selector.component';
import { CommentsModule } from '../comments/comments.module';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { BlogModule } from '../blogs/blog.module';

const routes: Routes = [
  { path: 'media/videos/:filter', component: MediaVideosListComponent },
  { path: 'media/videos', redirectTo: '/media/videos/top', pathMatch: 'full' },
  { path: 'media/images/:filter', component: MediaImagesListComponent },
  { path: 'media/images', redirectTo: '/media/images/top', pathMatch: 'full' },

  { path: 'media/edit/:guid', component: MediaEditComponent },
  { path: 'media/:container/:guid', component: MediaViewComponent },
  { path: 'media/:guid', component: MediaViewComponent },

  /* Legacy routes */
  { path: 'archive/view/:container/:guid', component: MediaViewComponent },
  { path: 'archive/view/:guid', component: MediaViewComponent },
  { path: 'archive/edit/:guid', component: MediaEditComponent },
];

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule.forChild(routes),
    NgFormsModule,
    ReactiveFormsModule,
    CommonModule,
    CommentsModule,
    LegacyModule,
    ModalsModule,
    MindsFormsModule,
    WireModule,
    PostMenuModule,
    VideoModule,
    HashtagsModule,
    BlogModule,
  ],
  declarations: [
    MediaVideosListComponent,
    MediaVideosTileComponent,
    MediaImagesListComponent,
    MediaImagesTileComponent,
    MediaEditComponent,
    MediaViewComponent,
    MediaTheatreComponent,
    MediaGridComponent,
    MediaViewRecommendedComponent,
    ThumbnailSelectorComponent,
    MediaModalComponent,
  ],
  entryComponents: [
    MediaVideosListComponent,
    MediaImagesListComponent,
    MediaEditComponent,
    MediaViewComponent,
    MediaModalComponent,
  ],
})
export class MediaModule {}
