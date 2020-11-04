import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BlogEditorComponent } from './../v2/edit/ckeditor/editor.component';
import { CaptchaModule } from '../../captcha/captcha.module';
import { BlogEditorV2Component } from '../v2/edit/editor-base.component';
import { BlogsEditService } from '../v2/edit/blog-edit.service';
import { BlogEditorDropdownComponent } from '../v2/edit/dropdown/dropdown.component';
import { BlogEditorMetaComponent } from '../v2/edit/bottom-bar/meta/meta.component';
import { BlogEditorBottomBarComponent } from '../v2/edit/bottom-bar/bottom-bar.component';
import { BlogEditorTagsComponent } from '../v2/edit/bottom-bar/tags/tags.component';
import { FormsModule } from '@angular/forms';
import { ComposerModule } from '../../composer/composer.module';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    CKEditorModule,
    CaptchaModule,
    FormsModule,
    ComposerModule,
  ],
  declarations: [
    BlogEditorComponent,
    BlogEditorV2Component,
    BlogEditorDropdownComponent,
    BlogEditorMetaComponent,
    BlogEditorBottomBarComponent,
    BlogEditorTagsComponent,
  ],
  exports: [BlogEditorComponent],
})
export class BlogV2Module {}
