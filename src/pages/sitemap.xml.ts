import type { APIRoute } from 'astro';

const routes = [
  '/',
  '/learn',
  '/playground',
  '/exercises',
  '/my-prompts',
  '/learn/models/chatgpt',
  '/learn/models/claude',
  '/learn/models/gemini',
  '/learn/use-cases/code',
  '/learn/use-cases/writing',
  '/learn/use-cases/data',
  '/learn/use-cases/research',
  '/learn/techniques/zeroshot',
  '/learn/techniques/fewshot',
  '/learn/techniques/cot',
  '/learn/techniques/role',
  '/learn/techniques/xml-tags',
  '/learn/techniques/system-prompts',
  '/learn/techniques/chain-prompts',
  '/learn/techniques/tot',
  '/learn/techniques/meta',
  '/learn/techniques/reflection'
];

const priorityByPath: Record<string, string> = {
  '/': '1.0',
  '/learn': '0.9',
  '/playground': '0.8',
  '/exercises': '0.8',
  '/my-prompts': '0.7'
};

export const GET: APIRoute = ({ site, url }) => {
  const base = site ?? new URL(url.origin);
  const lastMod = new Date().toISOString();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((path) => {
    const loc = new URL(path, base).toString();
    const priority = priorityByPath[path] ?? '0.6';
    return `<url><loc>${loc}</loc><lastmod>${lastMod}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
  })
  .join('')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
