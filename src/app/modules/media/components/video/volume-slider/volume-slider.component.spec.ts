///<reference path="../../../../../../../node_modules/@types/jasmine/index.d.ts"/>
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  Component,
  DebugElement,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule as NgCommonModule } from '@angular/common';
import { MindsVideoVolumeSlider } from './volume-slider.component';
import { MindsPlayerInterface } from '../players/player.interface';

class MindsVideoDirectHttpPlayerMock implements MindsPlayerInterface {
  @Input() muted: boolean;
  @Input() poster: string;
  @Input() autoplay: boolean;
  @Input() src: string;

  @Output() onPlay: EventEmitter<HTMLVideoElement> = new EventEmitter();
  @Output() onPause: EventEmitter<HTMLVideoElement> = new EventEmitter();
  @Output() onEnd: EventEmitter<HTMLVideoElement> = new EventEmitter();
  @Output() onError: EventEmitter<{
    player: HTMLVideoElement;
    e;
  }> = new EventEmitter();

  getPlayer = (): HTMLVideoElement => {
    return null;
  };

  play = () => {};
  pause = () => {};
  toggle = () => {};

  resumeFromTime = () => {};

  isLoading = (): boolean => {
    return false;
  };
  isPlaying = (): boolean => {
    return false;
  };

  requestFullScreen = jasmine.createSpy('requestFullScreen').and.stub();

  getInfo = () => {};
}

describe('MindsVideoVolumeSlider', () => {
  let comp: MindsVideoVolumeSlider;
  let fixture: ComponentFixture<MindsVideoVolumeSlider>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MindsVideoVolumeSlider], // declare the test component
      imports: [FormsModule, RouterTestingModule, NgCommonModule],
    }).compileComponents(); // compile template and css
  }));

  beforeEach(done => {
    window.addEventListener = () => {};
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(MindsVideoVolumeSlider);
    comp = fixture.componentInstance;

    const video = document.createElement('video');
    video.src = 'thisisavideo.mp4';
    comp.element = video;

    const playerRef = new MindsVideoDirectHttpPlayerMock();
    playerRef.getPlayer = () => {
      return video;
    };

    comp.playerRef = playerRef;

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

  it('should render a hidden slider', () => {
    const wrapper = fixture.debugElement.query(
      By.css('.m-video--volume-control-wrapper')
    );
    const control = fixture.debugElement.query(
      By.css('.m-video--volume-control')
    );
    const icon = fixture.debugElement.query(By.css('.material-icons'));
    const input = fixture.debugElement.query(By.css('input'));
    expect(control).not.toBeNull();
    expect(input).not.toBeNull();
    expect(icon).not.toBeNull();
    expect(wrapper).not.toBeNull();
  });
});
