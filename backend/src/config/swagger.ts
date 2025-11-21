export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'DRLTAS API',
    version: '1.0.0',
    description: 'Digital Readiness & Legacy-Transfer Audit System API',
  },
  servers: [
    { url: 'http://localhost:3001/api/v1', description: 'Development' },
    { url: 'https://api.drltas.local/api/v1', description: 'Production' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          role: { type: 'string', enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
        },
      },
      Assessment: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          assessmentName: { type: 'string' },
          status: { type: 'string' },
          completionPercentage: { type: 'number' },
        },
      },
    },
  },
  paths: {
    '/auth/login': {
      post: {
        summary: 'User Login',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object' } } },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'User Registration',
        tags: ['Authentication'],
        responses: { 201: { description: 'User registered' } },
      },
    },
    '/assessments': {
      get: {
        summary: 'List Assessments',
        tags: ['Assessments'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Assessments list' } },
      },
      post: {
        summary: 'Create Assessment',
        tags: ['Assessments'],
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Assessment created' } },
      },
    },
    '/assessments/{id}': {
      get: {
        summary: 'Get Assessment',
        tags: ['Assessments'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Assessment details' } },
      },
    },
    '/health': {
      get: {
        summary: 'Health Check',
        tags: ['System'],
        responses: { 200: { description: 'Server is running' } },
      },
    },
  },
};

export const swaggerOptions = { definition: swaggerDefinition, apis: [] };
