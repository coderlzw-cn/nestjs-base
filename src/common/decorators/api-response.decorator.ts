import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiBodyOptions,
  ApiHeader,
  ApiHeaderOptions,
  ApiOperation,
  ApiParam,
  ApiParamOptions,
  ApiQuery,
  ApiQueryOptions,
  ApiResponse,
  ApiResponseOptions,
} from '@nestjs/swagger';

export interface ApiEndpointConfig {
  // 接口描述
  summary: string;
  tags?: string[];
  description?: string;
  deprecated?: boolean;

  // 请求头
  headers?: ApiHeaderOptions[];

  // 请求参数
  params?: ApiParamOptions[];
  queries?: ApiQueryOptions[];
  body?: ApiBodyOptions;

  // 响应
  response?: ApiResponseOptions;
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

  // ApiHeader
  if (config.headers && config.headers.length > 0) {
    config.headers.forEach((header) => {
      decorators.push(ApiHeader(header));
    });
  }

  // ApiParam
  if (config.params && config.params.length > 0) {
    config.params.forEach((param) => {
      decorators.push(ApiParam(param));
    });
  }

  // // ApiQuery - 包括分页参数
  const queries = config.queries;
  if (queries && queries.length > 0) {
    queries.forEach((query) => {
      decorators.push(ApiQuery(query));
    });
  }

  // // ApiBody
  if (config.body) {
    decorators.push(ApiBody(config.body));
  }

  // ApiResponse
  if (config.response) {
    decorators.push(ApiResponse(config.response));
  }

  // 添加常见的错误响应
  commonErrorResponses.forEach((error) => {
    decorators.push(ApiResponse(error));
  });

  return applyDecorators(...decorators);
};
