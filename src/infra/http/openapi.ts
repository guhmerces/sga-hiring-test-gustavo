import { generateSchema } from "@anatine/zod-openapi";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { createUserRequestSchema } from "src/application/dtos/schemas";

export default {
  users: {
    signup: {
      schema: {
        summary: 'Create a user',
        tags: ['user'],
        description: 'Create a user',
        requestBody: {
          content: {
            'application/json': {
              schema: generateSchema(createUserRequestSchema) as SchemaObject
            }
          }
        }
      }
    },
  },
}
