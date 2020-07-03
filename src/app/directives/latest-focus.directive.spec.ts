import { LatestFocusDirective } from './latest-focus.directive';

describe('LatestFocusDirective', () => {
  it('should create an instance', () => {
    let a;
    let b;
    const directive = new LatestFocusDirective(a,b);
    expect(directive).toBeTruthy();
  });
});
