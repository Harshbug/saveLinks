const { z } = require('zod');

const httpUrl = z.string().url().refine(
  (u) => /^https?:\/\//i.test(u),
  'Only http/https URLs allowed'
);

const createLinkSchema = z.object({ url: httpUrl });

const updateLinkSchema = z.object({
  url: httpUrl,
  title: z.string().max(200),
  description: z.string().max(1000),
  tags: z.array(z.string().max(30)).max(20),
  isFavorite: z.boolean(),
}).partial().strict();

module.exports = { createLinkSchema, updateLinkSchema };