import { IncrementPipe } from './increment.pipe';

describe('IncrementPipe', () => {
  it('create an instance', () => {
    const pipe = new IncrementPipe();
    expect(pipe).toBeTruthy();
  });
});
