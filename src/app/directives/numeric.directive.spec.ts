import { NumericDirective } from './numeric.directive';

describe('NumericDirective', () => {
  it('should create an instance', () => {
    let a, b;
    const directive = new NumericDirective(a,b);
    expect(directive).toBeTruthy();
  });
});
