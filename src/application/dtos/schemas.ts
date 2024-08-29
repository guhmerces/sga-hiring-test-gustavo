import { z } from "zod";

export const createUserRequestSchema = z.object({
  email: z.string().email({ message: 'invalid email' }),
  password: z.string(),
  passwordConfirmation: z.string()
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