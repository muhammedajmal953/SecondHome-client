import { ToFirstCapitalPipe } from './to-first-capital.pipe';

describe('ToFirstCapitalPipe', () => {
  it('create an instance', () => {
    const pipe = new ToFirstCapitalPipe();
    expect(pipe).toBeTruthy();
  });
});
