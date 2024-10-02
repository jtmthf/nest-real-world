import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const loginUserSchema = z.object({
  user: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const loginUserResponseSchema = z.object({
  user: z.object({
    email: z.string().email(),
    username: z.string(),
    token: z.string(),
    bio: z.preprocess((value) => value ?? null, z.string().nullable()),
    image: z.preprocess((value) => value ?? null, z.string().nullable()),
  }),
});

export const loginUserJsonSchema = zodToJsonSchema(loginUserSchema, {
  target: 'openApi3',
});
export const loginUserResponseJsonSchema = zodToJsonSchema(
  loginUserResponseSchema,
  {
    target: 'openApi3',
  },
);

export type LoginUserDto = z.infer<typeof loginUserSchema>;
export type LoginUserResponseDto = z.infer<typeof loginUserResponseSchema>;
