import MarkdownIt from 'markdown-it';
import plainText from 'markdown-it-plain-text';
import iframe from 'markdown-it-iframe';

/**
 * マークダウンをHTMLに変換する
 * @param markdown
 * @return string
 */
export const markdownToHtml = (markdown: string) => {
  const md = new MarkdownIt().use(iframe);
  md.render(markdown);
  return md as any;
};

/**
 * マークダウンをプレーンテキストに変換する
 * @param markdown
 * @return string
 */
export const markdownToPlain = (markdown: string) => {
  const md = new MarkdownIt();
  md.use(plainText);
  md.render(markdown);
  return (md as any).plainText;
};
