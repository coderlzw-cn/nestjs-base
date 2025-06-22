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
  example?: any;
}

/**
 * API 查询参数接口
 */
export interface ApiQueryConfig {
  name: string;
  description?: string;
  required?: boolean;
  type?: string;
  example?: any;
  enum?: any[];
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
 * 完整的API装饰器配置
 */
export interface ApiEndpointConfig<TModel = any> {
  summary: string;
  description?: string;
  tags?: string[];
  params?: ApiParamConfig[];
  queries?: ApiQueryConfig[];
  headers?: ApiHeaderConfig[];
  body?: Type<TModel>;
  response?: Type<TModel>;
  status?: number;
  responseDescription?: string;
  deprecated?: boolean;
  pagination?: PaginationConfig;
}

/**
 * 完整的API端点装饰器
 * 将 ApiOperation、ApiParam、ApiResponse、ApiBody 等装饰器结合在一起
 * @param config 装饰器配置
 * @returns 装饰器
 * @example
 * @ApiEndpoint({
 *   summary: '获取用户信息',
 *   description: '根据用户ID获取用户详细信息',
 *   tags: ['用户管理'],
 *   params: [
 *     { name: 'id', description: '用户ID', type: 'number', example: 1 }
 *   ],
 *   response: User,
 *   status: 200,
 *   responseDescription: '获取用户成功'
 * })
 */
export const ApiEndpoint = (config: ApiEndpointConfig) => {
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

  // ApiParam
  if (config.params && config.params.length > 0) {
    config.params.forEach((param) => {
      decorators.push(
        ApiParam({
          name: param.name,
          description: param.description,
          required: param.required ?? true,
          type: param.type as any,
          example: param.example,
        }),
      );
    });
  }

  // ApiQuery - 包括分页参数
  const queries = [...(config.queries || [])];

  // 如果启用了分页，自动添加分页查询参数
  if (config.pagination?.enabled) {
    const pageParam = config.pagination.pageParam || 'page';
    const limitParam = config.pagination.limitParam || 'limit';
    const searchParam = config.pagination.searchParam || 'search';
    const sortParam = config.pagination.sortParam || 'sort';

    // 检查是否已经存在分页参数，避免重复
    const existingParams = new Set(queries.map((q) => q.name));

    if (!existingParams.has(pageParam)) {
      queries.push({
        name: pageParam,
        description: '页码',
        type: 'number',
        example: config.pagination.defaultPage || 1,
        required: false,
      });
    }

    if (!existingParams.has(limitParam)) {
      queries.push({
        name: limitParam,
        description: '每页数量',
        type: 'number',
        example: config.pagination.defaultLimit || 10,
        required: false,
      });
    }

    if (!existingParams.has(searchParam)) {
      queries.push({
        name: searchParam,
        description: '搜索关键词',
        type: 'string',
        example: '',
        required: false,
      });
    }

    if (!existingParams.has(sortParam)) {
      queries.push({
        name: sortParam,
        description: '排序字段',
        type: 'string',
        example: 'createdAt',
        required: false,
      });
    }
  }

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

  // ApiBody
  if (config.body) {
    decorators.push(
      ApiBody({
        type: config.body,
        description: `请求体 - ${config.summary}`,
      }),
    );
  }

  // ApiResponse - 根据是否启用分页生成不同的响应
  if (config.pagination?.enabled) {
    // 分页响应
    decorators.push(
      ApiResponse({
        status: config.status || 200,
        description: config.responseDescription || '操作成功',
        schema: {
          allOf: [
            {
              properties: {
                code: { type: 'number', example: config.status || 200 },
                message: { type: 'string', example: 'Success' },
                data: {
                  type: 'object',
                  properties: {
                    list: {
                      type: 'array',
                      items: config.response ? { $ref: getSchemaPath(config.response) } : { type: 'object' },
                    },
                    total: { type: 'number', example: 100 },
                    page: { type: 'number', example: config.pagination.defaultPage || 1 },
                    pageSize: { type: 'number', example: config.pagination.defaultLimit || 10 },
                    pages: { type: 'number', example: 10 },
                  },
                },
              },
            },
          ],
        },
      }),
    );
  } else if (config.response) {
    // 普通响应
    decorators.push(
      ApiResponse({
        status: config.status || 200,
        description: config.responseDescription || '操作成功',
        schema: {
          allOf: [
            {
              properties: {
                code: { type: 'number', example: config.status || 200 },
                message: { type: 'string', example: 'Success' },
                data: { $ref: getSchemaPath(config.response) },
              },
            },
          ],
        },
      }),
    );
  } else {
    // 默认成功响应
    decorators.push(
      ApiResponse({
        status: config.status || 200,
        description: config.responseDescription || '操作成功',
        schema: {
          properties: {
            code: { type: 'number', example: config.status || 200 },
            message: { type: 'string', example: 'Success' },
            data: { type: 'object', example: {} },
          },
        },
      }),
    );
  }

  // 添加常见的错误响应
  decorators.push(
    ApiResponse({
      status: 400,
      description: '请求参数错误',
      schema: {
        properties: {
          code: { type: 'number', example: 400 },
          message: { type: 'string', example: 'Bad Request' },
          errors: { type: 'array', items: { type: 'string' } },
        },
      },
    }),
  );

  return applyDecorators(...decorators);
};
