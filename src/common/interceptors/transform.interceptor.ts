import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  message: string;
  code: number;
  data: T;
}

export interface CustomResponse<T> {
  message?: string;
  code?: number;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  /**
   * 生成标准化的返回结果
   * @param data 返回的数据
   * @param message 消息（可选，默认为 'success'）
   * @param code 状态码（可选，默认为 200）
   * @returns 标准化的响应对象
   */
  static success<T>(data: T, message?: string, code?: number): CustomResponse<T> {
    return {
      data,
      message: message || 'success',
      code: code || 200,
    };
  }

  /**
   * 生成错误返回结果
   * @param message 错误消息
   * @param code 错误状态码（可选，默认为 500）
   * @param data 错误数据（可选）
   * @returns 标准化的错误响应对象
   */
  static error<T = any>(message: string, code?: number, data?: T): CustomResponse<T | null> {
    return {
      data: data || null,
      message,
      code: code || 500,
    };
  }

  static pagination<T>(
    data: T,
    page: number,
    pageSize: number,
    total: number,
  ): CustomResponse<{
    list: T;
    currentPage: number;
    pageSize: number;
    total: number;
  }> {
    return {
      data: {
        list: data,
        currentPage: page,
        pageSize,
        total,
      },
    };
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: CustomResponse<T> | T) => {
        // 检查返回的数据是否已经包含 message 和 code
        if (data && typeof data === 'object' && 'data' in data) {
          const customResponse = data;
          return {
            data: customResponse.data,
            message: customResponse.message || 'success',
            code: customResponse.code || 200,
          };
        }

        // 如果没有自定义字段，使用默认值
        return {
          data: data,
          message: 'success',
          code: 200,
        };
      }),
    );
  }
}
