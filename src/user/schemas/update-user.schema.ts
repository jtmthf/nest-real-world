import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const updateUserSchema = z.object({
  user: z.object({
    email: z.string().email().optional(),
    username: z.string().optional(),
    password: z.string().min(12).optional(),
    bio: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
  }),
});

export const updateUserJsonSchema = zodToJsonSchema(updateUserSchema, {
  target: 'openApi3',
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
