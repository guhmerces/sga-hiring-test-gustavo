import { z } from "zod";

export const createUserRequestSchema = z.object({
  email: z.string().email({ message: 'invalid email' }),
  password: z.string().min(8).max(255),
  passwordConfirmation: z.string().min(8).max(255)
}).superRefine((arg, ctx) => {
  const { password, passwordConfirmation } = arg;

  if (passwordConfirmation !== password) {
    ctx.addIssue({
      code: "custom",
      message: "password, passwordConfirmation : Password fields dont match",
      path: ['password', 'passwordConfirmation']
    });
    return false;
  }
});

export const loginRequestSchema = z.object({
  email: z.string().email({ message: 'invalid email' }),
  password: z.string(),
});

export const createTutorialSchema = z.object({
  title: z.string().max(255),
});

export const updateTutorialSchema = createTutorialSchema;