/**
 * @description: Markdown 转 HTML。使用 marked，开启 GFM、自动换行。
 * @author: UG - 一个斗码大陆苦逼的三段码之气的少年，并没有神秘戒指中码老的帮助，但总有一天，我会成为斗码大陆中码帝一样的存在。三十年河东，三十年河西，莫欺少年穷。
 * @date: 2026-04-25
 */
import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: true,
});

export async function renderMarkdown(content: string | null | undefined): Promise<string> {
  if (!content) return '';
  return marked.parse(content) as Promise<string>;
}
