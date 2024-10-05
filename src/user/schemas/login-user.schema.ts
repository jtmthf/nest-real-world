import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const loginUserSchema = z.object({
  user: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const loginUserJsonSchema = zodToJsonSchema(loginUserSchema, {
  target: 'openApi3',
});

export type LoginUserDto = z.infer<typeof loginUserSchema>;
