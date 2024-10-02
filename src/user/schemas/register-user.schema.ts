import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const registerUserSchema = z.object({
  user: z.object({
    email: z.string().email(),
    username: z.string(),
    password: z.string().min(12),
  }),
});

export const registerUserResponseSchema = z.object({
  user: z.object({
    email: z.string().email(),
    username: z.string(),
    token: z.string(),
    bio: z.preprocess((value) => value ?? null, z.string().nullable()),
    image: z.preprocess((value) => value ?? null, z.string().nullable()),
  }),
});

export const registerUserJsonSchema = zodToJsonSchema(registerUserSchema, {
  target: 'openApi3',
});
export const registerUserResponseJsonSchema = zodToJsonSchema(
  registerUserResponseSchema,
  {
    target: 'openApi3',
  },
);

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
export type RegisterUserResponseDto = z.infer<
  typeof registerUserResponseSchema
>;
