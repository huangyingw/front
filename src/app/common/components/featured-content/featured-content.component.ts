import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  Input,
  OnInit,
  SkipSelf,
  ViewChild,
} from '@angular/core';
import { FeaturedContentService } from './featured-content.service';
import { DynamicHostDirective } from '../../directives/dynamic-host.directive';
import { Activity } from '../../../modules/legacy/components/cards/activity/activity';
import { ClientMetaService } from '../../services/client-meta.service';

@Component({
  selector: 'm-featured-content',
  providers: [ClientMetaService],
  templateUrl: 'featured-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedContentComponent implements OnInit {
  entity: any;

  @Input() slot: number = -1;

  @ViewChild(DynamicHostDirective, { static: false })
  dynamicHost: DynamicHostDirective;

  constructor(
    protected featuredContentService: FeaturedContentService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected cd: ChangeDetectorRef,
    protected clientMetaService: ClientMetaService,
    @SkipSelf() protected injector: Injector
  ) {
    this.clientMetaService.inherit(injector).setMedium('featured-content');
  }

  ngOnInit() {
    this.load();
  }

  async load() {
    try {
      this.entity = await this.featuredContentService.fetch();
    } catch (e) {
      console.error('FeaturedContentComponent.load', e);
    }

    this.update();
  }

  clear() {
    this.detectChanges();

    if (this.dynamicHost) {
      this.dynamicHost.viewContainerRef.clear();
    }
  }

  update() {
    this.clear();

    const { component, injector } = this.resolve();

    if (!this.dynamicHost) {
      console.log(
        'tried to load a boost but no dynamicHost found',
        this.entity
      );
      return;
    }

    if (component) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        component
      );

      const componentRef: ComponentRef<any> = this.dynamicHost.viewContainerRef.createComponent(
        componentFactory,
        void 0,
        this.injector
      );
      injector.call(this, componentRef, this.entity);
    }
  }

  resolve() {
    if (!this.entity) {
      return {};
    }

    if (this.entity.type === 'activity') {
      return {
        component: Activity,
        injector: (componentRef, entity) => {
          componentRef.instance.object = entity;
          componentRef.instance.slot = this.slot;
          componentRef.changeDetectorRef.detectChanges();
        },
      };
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
