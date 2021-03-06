import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef,
  OnInit,
  HostListener,
  Injector,
  SkipSelf,
} from '@angular/core';
import { ConfigsService } from '../../common/services/configs.service';
import { OverlayModalService } from '../../services/ux/overlay-modal';

@Component({
  selector: 'm-marketing__footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.ng.scss'],
})
export class MarketingFooterComponent {
  readonly year: number = new Date().getFullYear();

  readonly cdnAssetsUrl: string;

  constructor(
    private configs: ConfigsService,
    protected cd: ChangeDetectorRef,
    @SkipSelf() private injector: Injector
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }
}
