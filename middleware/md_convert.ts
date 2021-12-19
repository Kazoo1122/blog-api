import MarkdownIt from 'markdown-it';
import plainText from 'markdown-it-plain-text';

export const markdownToHtml = (markdown: string) => {
  const md = new MarkdownIt();
  return md.render(markdown);
};

export const markdownToPlain = (markdown: string) => {
  const md = new MarkdownIt();
  md.use(plainText);
  md.render(markdown);
  return (md as any).plainText;
};
