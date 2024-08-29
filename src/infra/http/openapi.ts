import { generateSchema } from "@anatine/zod-openapi";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { createUserRequestSchema, loginRequestSchema } from "src/application/dtos/schemas";

export default {
  user: {
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
    login: {
      schema: {
        summary: 'Retrieve a JWT token',
        tags: ['user'],
        description: 'Retrieve a JWT token',
        requestBody: {
          content: {
            'application/json': {
              schema: generateSchema(loginRequestSchema) as SchemaObject
            }
          }
        }
      }
    },
  },
}
