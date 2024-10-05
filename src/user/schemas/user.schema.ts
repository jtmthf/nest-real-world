import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const userResponseSchema = z.object({
  user: z.object({
    email: z.string().email(),
    username: z.string(),
    token: z.string(),
    bio: z.preprocess((value) => value ?? null, z.string().nullable()),
    image: z.preprocess((value) => value ?? null, z.string().nullable()),
  }),
});

export const userResponseJsonSchema = zodToJsonSchema(userResponseSchema, {
  target: 'openApi3',
});

export type UserResponseDto = z.infer<typeof userResponseSchema>;
