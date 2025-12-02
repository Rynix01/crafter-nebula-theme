export function lexicalToString(content: any): string {
    if (!content || typeof content !== 'object') return '';
    // Lexical JSON'da kök genellikle { root: { children: [...] } }
    const root = content.root || content;
    let text = '';
    function traverse(node: any) {
      if (!node) return;
      if (node.type === 'text' && typeof node.text === 'string') {
        text += node.text + ' ';
      }
      if (Array.isArray(node.children)) {
        node.children.forEach(traverse);
      }
    }
    if (Array.isArray(root.children)) {
      root.children.forEach(traverse);
    }
    return text.trim();
  }