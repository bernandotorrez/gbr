/**
 * Safe and lightweight Markdown to HTML converter
 * Supports standard Markdown (Headings, Bold, Italic, Lists, Links, Blockquotes, Images)
 * and preserves valid HTML tags for Rich Text flexibility.
 */
export function renderMarkdownAndHtml(content: string): string {
  if (!content) return '';

  // If content is already rich HTML (contains multiple <p>, <h2>, <h3>, <ul>, etc.)
  // and does NOT contain raw markdown syntax like ## or ** or - bullet
  const hasMarkdownHeadings = /(^|\n)#{1,6}\s+/m.test(content);
  const hasMarkdownBullets = /(^|\n)\s*[-*+]\s+/m.test(content);
  const hasMarkdownBold = /\*\*[^*]+\*\*/.test(content);
  const hasMarkdownQuotes = /(^|\n)>\s+/m.test(content);

  // If it's pure HTML without markdown tokens
  if (!hasMarkdownHeadings && !hasMarkdownBullets && !hasMarkdownBold && !hasMarkdownQuotes && content.includes('<p>')) {
    return content;
  }

  let html = content;

  // 1. Normalize line breaks
  html = html.replace(/\r\n/g, '\n');

  // 2. Blockquotes
  html = html.replace(/(?:^|\n)>\s?(.*)/g, '\n<blockquote>$1</blockquote>');
  // Combine consecutive blockquotes
  html = html.replace(/<\/blockquote>\s*<blockquote>/g, '<br/>');

  // 3. Headings
  html = html.replace(/^######\s+(.*)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.*)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');

  // 4. Horizontal Rules
  html = html.replace(/^---$/gm, '<hr class="my-6 border-gray-200" />');

  // 5. Images
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="rounded-2xl shadow-md my-6 w-full max-h-[450px] object-cover" />');

  // 6. Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#0E3B2E] font-bold underline hover:text-[#07241C]">$1</a>');

  // 7. Bold, Italic, Strikethrough
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

  // 8. Lists (Unordered)
  html = html.replace(/(?:^|\n)[-*+]\s+(.*)/g, '\n<li-item>$1</li-item>');
  html = html.replace(/(?:<li-item>.*?<\/li-item>\s*)+/gs, (match) => {
    const listItems = match.replace(/<li-item>(.*?)<\/li-item>/g, '<li class="my-1">$1</li>');
    return `\n<ul class="list-disc list-inside space-y-1.5 my-4 text-[#4A5568] pl-2">${listItems}</ul>\n`;
  });

  // 9. Lists (Ordered)
  html = html.replace(/(?:^|\n)\d+\.\s+(.*)/g, '\n<oli-item>$1</oli-item>');
  html = html.replace(/(?:<oli-item>.*?<\/oli-item>\s*)+/gs, (match) => {
    const listItems = match.replace(/<oli-item>(.*?)<\/oli-item>/g, '<li class="my-1">$1</li>');
    return `\n<ol class="list-decimal list-inside space-y-1.5 my-4 text-[#4A5568] pl-2">${listItems}</ol>\n`;
  });

  // 10. Paragraphs: Wrap chunks that aren't block elements in <p>
  const blocks = html.split(/\n{2,}/);
  const formattedBlocks = blocks.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    // If it already starts with a block tag, leave it
    if (/^<(h[1-6]|ul|ol|blockquote|p|hr|div|img|table)/i.test(trimmed)) {
      return trimmed;
    }
    // Replace single line breaks inside paragraph with <br/>
    const withBr = trimmed.replace(/\n/g, '<br/>');
    return `<p class="leading-relaxed text-[#4A5568] mb-4">${withBr}</p>`;
  });

  return formattedBlocks.filter(Boolean).join('\n');
}
