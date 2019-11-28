import { NgModule } from '@angular/core';

import { JobsMarketingComponent } from './marketing/marketing.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'jobs',
    component: JobsMarketingComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [JobsMarketingComponent],
  exports: [JobsMarketingComponent],
  entryComponents: [JobsMarketingComponent],
})
export class JobsMarketingModule {}
