import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const profileResponseSchema = z.object({
  profile: z.object({
    username: z.string(),
    bio: z.string().nullable(),
    image: z.string().nullable(),
    following: z.boolean(),
  }),
});

export const profileResponseJsonSchema = zodToJsonSchema(
  profileResponseSchema,
  {
    target: 'openApi3',
  },
);

export type ProfileResponseDto = z.infer<typeof profileResponseSchema>;
