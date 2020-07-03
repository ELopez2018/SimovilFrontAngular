import { trigger, state, style, transition, animate } from '@angular/animations';

// import { trigger, state, animate, style, transition } from '@angular/core';

export function fadeTransition() {
    return trigger('fade', [
        state('in', style({ opacity: '1' })),
        transition('void => *', [
            style({ opacity: '0' }),
            animate(300)
        ]),
        transition('* => void', [
            animate(300, style({ opacity: '0' }))
        ])
    ])
}
