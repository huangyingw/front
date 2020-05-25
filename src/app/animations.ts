import {
  trigger,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';

export const animations: any[] = [
  trigger('foolishIn', [
    transition('* => *', [
      style({ opacity: 0 }),
      animate(
        2000,
        keyframes([
          style({
            opacity: 0,
            transformOrigin: '50% 50%',
            transform: 'scale(0, 0)     rotate(360deg)',
            offset: 0.0,
          }),
          style({
            opacity: 1,
            transformOrigin: '0% 100%',
            transform: 'scale(0.5, 0.5) rotate(0deg)',
            offset: 0.066,
          }),
          style({
            opacity: 1,
            transformOrigin: '100% 100%',
            transform: 'scale(0.5, 0.5) rotate(0deg)',
            offset: 0.132,
          }),
          style({
            opacity: 1,
            transformOrigin: '0%',
            transform: 'scale(0.5, 0.5) rotate(0deg)',
            offset: 0.198,
          }),
          style({
            opacity: 1,
            transformOrigin: '0% 0%',
            transform: 'scale(0.5, 0.5) rotate(0deg)',
            offset: 0.264,
          }),
          style({
            opacity: 1,
            transformOrigin: '50% 50%',
            transform: 'scale(1, 1)     rotate(0deg)',
            offset: 0.33,
          }),
          style({ opacity: 1, offset: 0.66 }),
          style({ opacity: 0, offset: 1.0 }),
        ])
      ),
    ]),
  ]),
];

export const FastFadeAnimation = trigger('fastFade', [
  transition(':enter', [
    animate('200ms', keyframes([style({ opacity: 0 }), style({ opacity: 1 })])),
  ]),
  transition(':leave', [
    animate('100ms', keyframes([style({ opacity: 1 }), style({ opacity: 0 })])),
  ]),
]);
