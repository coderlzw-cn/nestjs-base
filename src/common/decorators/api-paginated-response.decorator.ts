// import { applyDecorators, Type } from '@nestjs/common';
// import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

// export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
//   return applyDecorators(
//     ApiOkResponse({
//       schema: {
//         allOf: [
//           {
//             properties: {
//               code: { type: 'number', example: 200 },
//               message: { type: 'string', example: 'Success' },
//               data: {
//                 type: 'object',
//                 properties: {
//                   items: {
//                     type: 'array',
//                     items: { $ref: getSchemaPath(model) },
//                   },
//                   total: { type: 'number', example: 100 },
//                   page: { type: 'number', example: 1 },
//                   limit: { type: 'number', example: 10 },
//                   totalPages: { type: 'number', example: 10 },
//                 },
//               },
//             },
//           },
//         ],
//       },
//     }),
//   );
// };
