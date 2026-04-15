import { defineCollection, z } from 'astro:content';

const realWorldPrompts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    sourceProject: z.string(),
    sourceUrl: z.string().url(),
    sourcePath: z.string(),
    sourceLicense: z.string(),
    modelFocus: z.string(),
    tags: z.array(z.string()),
    verifiedAt: z.string(),
    flavors: z
      .array(
        z.object({
          name: z.string(),
          sourceUrl: z.string().url(),
          sourcePath: z.string(),
          focus: z.string(),
          excerpt: z.string()
        })
      )
      .optional()
  })
});

export const collections = {
  'real-world-prompts': realWorldPrompts
};
