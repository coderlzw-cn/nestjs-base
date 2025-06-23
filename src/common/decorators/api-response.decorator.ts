import { applyDecorators, Type } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, getSchemaPath } from '@nestjs/swagger';

/**
 * API 参数接口
 */
export interface ApiParamConfig {
  name: string;
  description?: string;
  required?: boolean;
  type?: string;
  example?: unknown;
}

/**
 * API 查询参数接口
 */
export interface ApiQueryConfig {
  name: string;
  description?: string;
  required?: boolean;
  type?: string;
  example?: unknown;
  enum?: string[];
}

/**
 * API 请求头接口
 */
export interface ApiHeaderConfig {
  name: string;
  description?: string;
  required?: boolean;
  example?: string;
}

/**
 * 分页配置接口
 */
export interface PaginationConfig {
  enabled: boolean;
  defaultPage?: number;
  defaultLimit?: number;
  maxLimit?: number;
  pageParam?: string;
  limitParam?: string;
  searchParam?: string;
  sortParam?: string;
}

/**
 * 响应类型配置
 */
export interface ResponseConfig<TModel = any> {
  type?: Type<TModel>;
  isArray?: boolean;
  schema?: Record<string, unknown>;
  description?: string;
  status?: number;
}

/**
 * 完整的API装饰器配置
 */
export interface ApiEndpointConfig<TModel = any, TCreateDto = any, TUpdateDto = any> {
  summary: string;
  description?: string;
  tags?: string[];
  params?: ApiParamConfig[];
  queries?: ApiQueryConfig[];
  headers?: ApiHeaderConfig[];
  body?: Type<TCreateDto> | Type<TUpdateDto>;
  response?: ResponseConfig<TModel>;
  deprecated?: boolean;
  pagination?: PaginationConfig;
  responseDescription?: string;
  status?: number;
}

/**
 * 创建标准响应 schema
 */
function createResponseSchema(responseConfig: ResponseConfig, isPaginated = false) {
  const { type, isArray, schema, status = 200 } = responseConfig;

  if (isPaginated) {
    return {
      allOf: [
        {
          properties: {
            code: { type: 'number', example: status },
            message: { type: 'string', example: 'Success' },
            data: {
              type: 'object',
              properties: {
                list: {
                  type: 'array',
                  items: type ? { $ref: getSchemaPath(type) } : { type: 'object' },
                },
                total: { type: 'number', example: 100 },
                page: { type: 'number', example: 1 },
                pageSize: { type: 'number', example: 10 },
                pages: { type: 'number', example: 10 },
              },
            },
          },
        },
      ],
    };
  }

  if (schema) {
    return {
      allOf: [
        {
          properties: {
            code: { type: 'number', example: status },
            message: { type: 'string', example: 'Success' },
            data: schema,
          },
        },
      ],
    };
  }

  if (type) {
    const dataSchema: Record<string, unknown> = isArray ? { type: 'array', items: { $ref: getSchemaPath(type) } } : { $ref: getSchemaPath(type) };

    return {
      allOf: [
        {
          properties: {
            code: { type: 'number', example: status },
            message: { type: 'string', example: 'Success' },
            data: dataSchema,
          },
        },
      ],
    };
  }

  return {
    properties: {
      code: { type: 'number', example: status },
      message: { type: 'string', example: 'Success' },
      data: { type: 'object', example: {} },
    },
  };
}

// 常见错误响应
const commonErrorResponses = [
  {
    status: 400,
    description: '请求参数错误',
    schema: {
      properties: {
        code: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Bad Request' },
        errors: { type: 'array', items: { type: 'string' } },
      },
    },
  },
  {
    status: 401,
    description: '未授权',
    schema: {
      properties: {
        code: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  },
  {
    status: 500,
    description: '服务器内部错误',
    schema: {
      properties: {
        code: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal Server Error' },
      },
    },
  },
];

export const ApiEndpoint = <TModel = any, TCreateDto = any, TUpdateDto = any>(config: ApiEndpointConfig<TModel, TCreateDto, TUpdateDto>) => {
  const decorators: (ClassDecorator | MethodDecorator | PropertyDecorator)[] = [];

  // ApiOperation
  decorators.push(
    ApiOperation({
      summary: config.summary,
      description: config.description,
      tags: config.tags,
      deprecated: config.deprecated,
    }),
  );

  // ApiHeader
  if (config.headers && config.headers.length > 0) {
    config.headers.forEach((header) => {
      decorators.push(
        ApiHeader({
          name: header.name,
          description: header.description,
          required: header.required ?? false,
          example: header.example,
        }),
      );
    });
  }

  // ApiParam
  if (config.params && config.params.length > 0) {
    config.params.forEach((param) => {
      decorators.push(
        ApiParam({
          name: param.name,
          description: param.description,
          required: param.required ?? true,
          type: param.type,
          example: param.example,
        }),
      );
    });
  }

  // ApiQuery - 包括分页参数
  const queries: ApiQueryConfig[] = [...(config.queries || [])];

  // 如果启用了分页，自动添加分页查询参数

  if (queries.length > 0) {
    queries.forEach((query) => {
      decorators.push(
        ApiQuery({
          name: query.name,
          description: query.description,
          required: query.required ?? false,
          type: query.type,
          example: query.example,
          enum: query.enum,
        }),
      );
    });
  }

  // ApiBody
  if (config.body) {
    decorators.push(
      ApiBody({
        type: config.body,
        description: `请求体 - ${config.summary}`,
      }),
    );
  }

  // 处理响应配置
  const responseConfig = config.response || {};
  const status = responseConfig.status || config.status || 200;
  const description = responseConfig.description || config.responseDescription || '操作成功';

  // ApiResponse - 根据是否启用分页生成不同的响应
  if (config.pagination?.enabled) {
    // 分页响应
    decorators.push(
      ApiResponse({
        status,
        description,
        schema: createResponseSchema(responseConfig, true),
      }),
    );
  } else {
    // 普通响应
    decorators.push(
      ApiResponse({
        status,
        description,
        schema: createResponseSchema(responseConfig, false),
      }),
    );
  }

  // 添加常见的错误响应
  commonErrorResponses.forEach((error) => {
    decorators.push(ApiResponse(error));
  });

  return applyDecorators(...decorators);
};
