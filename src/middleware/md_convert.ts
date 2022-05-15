import MarkdownIt from 'markdown-it';
import plainText from 'markdown-it-plain-text';

/**
 * マークダウンをHTMLに変換する
 * @param markdown
 * @return string
 */
export const markdownToHtml = (markdown: string) => {
  const md = new MarkdownIt({ html: true });
  return md.render(markdown);
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
