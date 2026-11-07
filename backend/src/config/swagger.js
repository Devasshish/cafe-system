import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cafe Menu & Order Management System API',
      version: '1.0.0',
      description:
        'Production-grade RESTful API documentation for Cafe Royale. Provides public customer endpoints for menu browsing and table ordering, alongside JWT-protected administration endpoints.',
      contact: {
        name: 'Cafe Royale Engineering Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'Enter JWT token generated via POST /api/admin/login (e.g., Bearer eyJhbGciOi...)',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Validation failed or resource not found',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'price' },
                  message: { type: 'string', example: 'Price must be a positive number' },
                },
              },
            },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            totalItems: { type: 'integer', example: 12 },
            totalPages: { type: 'integer', example: 2 },
            currentPage: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            hasNextPage: { type: 'boolean', example: true },
            hasPrevPage: { type: 'boolean', example: false },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
