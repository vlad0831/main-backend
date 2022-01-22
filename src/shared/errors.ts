import { ApolloError } from 'apollo-server-core';

export class NotFoundError extends ApolloError {
  constructor(message?: string, extensions: Record<string, any> = {}) {
    super(message || 'Not found error', 'NOT_FOUND_ERROR', extensions);
    Object.defineProperty(this, 'name', { value: this.constructor.name });
  }
}

export class BadRequestError extends ApolloError {
  constructor(message?: string, extensions: Record<string, any> = {}) {
    super(message || 'Bad request error', 'BAD_REQUEST_ERROR', extensions);
    Object.defineProperty(this, 'name', { value: this.constructor.name });
  }
}
