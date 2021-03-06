import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigsService } from '../../common/services/configs.service';
import { BuyTokensModalService } from '../blockchain/token-purchase/v2/buy-tokens-modal.service';

@Component({
  selector: 'm-upgrades__buyTokens',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'buy-tokens.component.html',
})
export class BuyTokensComponent {
  readonly cdnAssetsUrl: string;

  constructor(
    protected router: Router,
    configs: ConfigsService,
    private buyTokensModalService: BuyTokensModalService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  async openBuyTokens(e): Promise<void> {
    await this.buyTokensModalService.open();
  }
}
