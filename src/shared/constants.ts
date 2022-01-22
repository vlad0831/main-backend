import * as process from 'process';

export const IS_PROD = process.env.NODE_ENV === 'production';
