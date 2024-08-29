import { generateSchema } from "@anatine/zod-openapi";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { createTutorialSchema, createUserRequestSchema, loginRequestSchema } from "src/application/dtos/schemas";

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
  tutorial: {
    create: {
      schema: {
        summary: 'Create a tutorial',
        tags: ['tutorial'],
        description: 'Create a tutorial',
        requestBody: {
          content: {
            'application/json': {
              schema: generateSchema(createTutorialSchema) as SchemaObject
            }
          }
        }
      }
    },
    update: {
      schema: {
        summary: 'Update a tutorial',
        tags: ['tutorial'],
        description: 'Update a tutorial',
        requestBody: {
          content: {
            'application/json': {
              schema: generateSchema(createTutorialSchema) as SchemaObject
            }
          }
        }
      }
    },
    delete: {
      schema: {
        summary: 'Delete a tutorial',
        tags: ['tutorial'],
        description: 'Delete a tutorial by id',
      }
    },
    all: {
      schema: {
        summary: 'Get all tutorials',
        tags: ['tutorial'],
        description: 'Get all tutorials',
      }
    },
  },
}
