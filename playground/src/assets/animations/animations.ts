import {
    animate,
    keyframes,
    query,
    stagger,
    style,
    transition,
    trigger,
  } from '@angular/animations';

  export const verticalSizeAnimation = trigger('verticalAppear', [
    transition(':enter', [
        style({ height: 0  }),
        animate('.5s ease', style({ height: '*' }))
    ])
  ]);

  export const fadeAnimation = trigger('fade', [
    transition(':enter', [
      style({ opacity: 0}),
      animate('.25s ease', style({ opacity: 1 }))
    ]),
    // transition(':leave', [
    //   style({ opacity: 1}),
    //   animate('.25s ease', style({ opacity: 0 }))
    // ])
  ]);

  export const fadeUpAnimation = trigger('fadeUp', [
    transition(':enter', [
      style({ opacity: 0 , transform: 'translateX(10px)'}),
      animate('.25s ease', style({ opacity: 1, transform: 'translateX(0px)'}))
    ]),
    transition(':leave', [
      style({ opacity: 1, transform: 'translateX(0px)' }),
      animate('.25s ease', style({ opacity: 0, transform: 'translateX(10px)' }))
    ])
  ]);

  export const fadeUpEnterLeaveAnimation = trigger('fadeUpEnterLeave', [
    transition(':enter', [
      style({ opacity: 0 , transform: 'translateY(10px)'}),
      animate('.25s ease', style({ opacity: 1, transform: 'translateY(0px)'}))
    ]),
    transition(':leave', [
      style({ opacity: 1, transform: 'translateY(0px)' }),
      animate('.15s ease', style({ opacity: 0, transform: 'translateY(3px)' }))
    ])
  ]);

  export const fadeUpSlowAnimation = trigger('fadeUpSlow', [
    transition(':enter', [
      style({ opacity: 0 , transform: 'translateY(10px)'}),
      animate('.65s ease', style({ opacity: 1, transform: 'translateY(0px)'}))
    ]),
    transition(':leave', [
      style({ opacity: 1, transform: 'translateY(0px)' }),
      animate('.25s ease', style({ opacity: 0, transform: 'translateY(3px)' }))
    ])
  ]);
  
  export const animatedList = trigger('listAnimation', [
    transition(':enter', [
      query(
        ':enter',
        style({
          opacity: 0,
        }),
        { optional: true }
      ),
      query(
        ':enter',
        stagger('100ms', [
          animate(
            '.25s ease',
            keyframes([
              style({ opacity: 0, transform: 'translateY(10px)', offset: 0 }),
              style({
                opacity: 1,
                transform: 'translateY(0)',
                offset: 1,
              }),
            ])
          ),
        ]),
        { optional: true }
      ),
    ]),
  ]);
  