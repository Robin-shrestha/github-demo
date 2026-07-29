const modules = import.meta.glob("../../Docs/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

export interface DocEntry {
  slug: string;
  title: string;
  content: string;
}

function slugFromPath(path: string): string {
  const filename = path.split("/").pop() ?? path;
  return filename.replace(/\.md$/, "");
}

function titleFromContent(content: string, fallback: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

export const docs: DocEntry[] = Object.entries(modules)
  .map(([path, content]) => {
    const slug = slugFromPath(path);
    return { slug, title: titleFromContent(content, slug), content };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

export function getDocBySlug(slug: string): DocEntry | undefined {
  return docs.find((doc) => doc.slug === slug);
}
