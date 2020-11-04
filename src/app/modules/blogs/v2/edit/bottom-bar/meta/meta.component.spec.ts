import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogEditorMetaComponent } from './meta.component';
import { FormsModule } from '@angular/forms';
import { clientMock } from '../../../../../../../tests/client-mock.spec';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { MockService } from '../../../../../../utils/mock';
import { BlogsEditService } from '../../blog-edit.service';
import { SiteService } from '../../../../../../common/services/site.service';
import { Session } from '../../../../../../services/session';
import { By } from '@angular/platform-browser';

describe('BlogEditorMetaComponent', () => {
  let comp: BlogEditorMetaComponent;
  let fixture: ComponentFixture<BlogEditorMetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlogEditorMetaComponent],
      imports: [RouterTestingModule, NgCommonModule, FormsModule],
      providers: [
        { provide: BlogsEditService, useValue: MockService(BlogsEditService) },
        {
          provide: SiteService,
          useValue: MockService(SiteService, {
            baseUrl: 'https://www.minds.com/',
          }),
        },
        {
          provide: Session,
          useValue: MockService(Session, {
            getLoggedInUser: () => {
              return {
                username: 'test',
              };
            },
          }),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(async done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(BlogEditorMetaComponent);

    comp = fixture.componentInstance; // BlogEditorMetaComponent test instance

    clientMock.response = [];

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should show correct user slug when input empty', () => {
    const example = fixture.debugElement.query(
      By.css('.m-blogMeta__labelContainer span em')
    );
    expect(example).not.toBeNull();
    expect(example.nativeElement.textContent).toContain('falsetest/blog/-xxxx');
  });
});
