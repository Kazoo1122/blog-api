import { unified } from 'unified';
import remarkParse from 'remark-parse/lib';
import remarkToRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify/lib';
import removeMd from 'remove-markdown';

/**
 * @param markdown
 * @returns string markdownをhtmlに変換した結果
 */
export const markdownToHtml = async (markdown: string) => {
  const html = await unified()
    .use(remarkParse) // markdown => mdast(markdownのAST、ASTは抽象構文木) への変換
    .use(remarkToRehype) // mdast => hast(htmlのAST) への変換
    .use(rehypeStringify) // hast => html への変換
    .process(markdown); // 実行
  return html.toString();
};

export const markdownToPlain = (markdown: string) => {
  return removeMd(markdown);
};
