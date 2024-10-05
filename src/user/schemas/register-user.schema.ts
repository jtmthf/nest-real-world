import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const registerUserSchema = z.object({
  user: z.object({
    email: z.string().email(),
    username: z.string(),
    password: z.string().min(12),
  }),
});

export const registerUserJsonSchema = zodToJsonSchema(registerUserSchema, {
  target: 'openApi3',
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
