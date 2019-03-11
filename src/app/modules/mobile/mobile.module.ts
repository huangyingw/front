import { NgModule } from '@angular/core';

import { MobileMarketingComponent } from './marketing/marketing.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { MobileService } from "./mobile.service";
import { HttpClient } from "@angular/common/http";
import { FeaturesService } from "../../services/features.service";

const routes: Routes = [
  {
    path: 'mobile',
    component: MobileMarketingComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgCommonModule,
    CommonModule,
  ],
  declarations: [
    MobileMarketingComponent
  ],
  exports: [
    MobileMarketingComponent
  ],
  entryComponents: [
    MobileMarketingComponent,
  ],
  providers: [
    {
      provide: MobileService,
      useFactory: MobileService._,
      deps: [ HttpClient, FeaturesService ]
    }
  ]
})

export class MobileModule {
}
