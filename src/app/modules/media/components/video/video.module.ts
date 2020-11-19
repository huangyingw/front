import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { MindsVideoPlayerComponent } from '../video-player/player.component';
import { PlyrModule } from 'ngx-plyr';
import { ScrollAwareVideoPlayerComponent } from '../video-player/scrollaware-player.component';

@NgModule({
  imports: [NgCommonModule, RouterModule.forChild([]), PlyrModule],
  declarations: [MindsVideoPlayerComponent, ScrollAwareVideoPlayerComponent],
  exports: [MindsVideoPlayerComponent, ScrollAwareVideoPlayerComponent],
})
export class VideoModule {}
