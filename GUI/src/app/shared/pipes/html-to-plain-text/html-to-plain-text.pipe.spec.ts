import { HtmlToPlaintextPipe } from "./html-to-plain-text.pipe";

describe('HtmlToPlainTextPipe', () => {
  it('create an instance', () => {
    const pipe = new HtmlToPlaintextPipe();
    expect(pipe).toBeTruthy();
  });
});
