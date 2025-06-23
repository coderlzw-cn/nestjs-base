import { registerAs } from '@nestjs/config';
import { I18nOptionsWithoutResolvers } from 'nestjs-i18n';
import path from 'node:path';

export const i18nConfiguration = registerAs<I18nOptionsWithoutResolvers>('i18n', () => ({
  fallbackLanguage: 'zh',
  fallbacks: {
    'en-*': 'en', //  `en-XX`（如 `en-US`, `en-GB`）会回退到 `en`
    'en_*': 'en', //  `en-XX`（如 `en_US`, `en_GB`）会回退到 `en`
    'zh_*': 'zh',
    'zh-*': 'zh',
    en: 'en',
    zh: 'zh',
  },
  logging: process.env.NODE_ENV !== 'dev',
  loaderOptions: {
    path: path.join(__dirname, '../../resources/i18n/'),
    watch: true,
    includeSubfolders: true,
  },
  typesOutputPath: process.env.NODE_ENV === 'dev' ? path.join(`${process.cwd()}/src/shared/i18n/generated.ts`) : undefined,
}));
