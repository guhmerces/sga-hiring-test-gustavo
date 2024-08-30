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

const transformNumber = ( v ) => Number(v)

export const paginatedQuerySchema = z.object({
  page: z.string().default('0').transform(transformNumber),
  offset: z.string().default('0').transform(transformNumber),
  limit: z.string().default('30').transform(transformNumber),
}).transform((input, ctx) => {
  let { limit, page } = input

  input.offset = page ? page * limit : 0;
  
  return input;
})

export const getTutorialsQuerySchema = z.object({
  title: z.string().max(255).optional(),
  creationDate: z.string().optional()
}).and(paginatedQuerySchema).superRefine((input, ctx) => {
  const { creationDate } = input

  if (creationDate) {
    const r = new RegExp(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)
    
    // check creationDate format
    const isValidFormat = r.test(creationDate)

    if (!isValidFormat) {
      ctx.addIssue({
        code: 'custom',
        message: 'Format should be one of the following : dd/mm/yyyy or dd.mm.yyyy or dd-mm-yyyy',
        path: ['creationDate'],
        params: {
          price: 'invalid'
        }
      })
      return false;
    }
  }
})
