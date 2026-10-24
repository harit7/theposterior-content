// Keeps community posts free of code that runs.
//
// Posts come from a public repository, and MDX can execute JavaScript while the site builds or
// when a reader opens the page. This plugin fails the build on anything beyond plain content and
// the site's own building blocks: import/export, {...} expressions, unknown components, script-like
// HTML tags, event-handler attributes and javascript: links. Component attributes may only be
// literal strings, numbers, booleans or lists of them.
//
// This is a copy of the website's src/plugins/remark-content-guard.mjs, for quick feedback on pull
// requests. The website's copy is the one that counts when the site builds.
import { visit } from 'unist-util-visit';

export const COMPONENTS = new Set([
  'Sidenote', 'Figure', 'CalibrationShift', 'ReliabilityPair', 'EceEstimators', 'ModelBars', 'JevBoard', 'DecisionBoard', 'TypeGaps',
]);
const BLOCKED_TAGS = new Set(['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'link', 'meta', 'base']);
const SCALAR = String.raw`(?:true|false|-?\d+(?:\.\d+)?|"[^"\\]*"|'[^'\\]*')`;
const LITERAL = new RegExp(String.raw`^\s*(?:${SCALAR}|\[\s*(?:${SCALAR}\s*(?:,\s*${SCALAR}\s*)*)?,?\s*\])\s*$`);

export default function remarkContentGuard() {
  return (tree, file) => {
    const fail = (node, why) => {
      const line = node.position?.start?.line;
      throw new Error(`${file.path}${line ? `:${line}` : ''}: ${why}. Posts may contain only text and the site's building blocks.`);
    };
    visit(tree, (node) => {
      if (node.type === 'mdxjsEsm') fail(node, 'import and export are not allowed');
      if (node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression') fail(node, '{...} expressions are not allowed');
      if (node.type === 'html' && /<\s*(script|style|iframe|object|embed)\b|\son\w+\s*=|javascript:/i.test(node.value)) fail(node, 'script-like HTML is not allowed');
      if (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') return;
      const name = node.name ?? '';
      if (/^[A-Z]/.test(name) && !COMPONENTS.has(name)) fail(node, `unknown component <${name}>`);
      if (name.includes('.')) fail(node, `component member access <${name}> is not allowed`);
      if (BLOCKED_TAGS.has(name.toLowerCase())) fail(node, `<${name}> is not allowed`);
      for (const attr of node.attributes) {
        if (attr.type === 'mdxJsxExpressionAttribute') fail(node, 'spread attributes are not allowed');
        if (/^on/i.test(attr.name)) fail(node, `event handler ${attr.name} is not allowed`);
        if (typeof attr.value === 'string' && /^\s*javascript:/i.test(attr.value)) fail(node, 'javascript: links are not allowed');
        if (attr.value && typeof attr.value === 'object' && !LITERAL.test(attr.value.value)) {
          fail(node, `attribute ${attr.name} must be a plain string, number, true/false or a list of them`);
        }
      }
    });
  };
}
