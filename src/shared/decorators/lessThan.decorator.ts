import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  buildMessage,
} from 'class-validator';

export function IsLessThan<T>(
  valFn: (object: T) => unknown,
  validationOptions?: ValidationOptions
) {
  return function (object: T, propertyName: string) {
    registerDecorator({
      name: 'isLessThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [valFn],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [valFn] = args.constraints;
          return value < valFn(args.object);
        },
        defaultMessage: buildMessage((eachPrefix, args) => {
          const [valFn] = args.constraints;
          return `${eachPrefix}$property must be less than ${valFn(
            args.object
          )}`;
        }, validationOptions),
      },
    });
  };
}
