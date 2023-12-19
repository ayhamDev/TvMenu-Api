// is-number-string.decorator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";
import { IsNumberOrPercentStringConstraint } from "./is-number-or-percentage.validator";

export function IsNumberOrPercentage(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNumberOrPercentStringConstraint,
    });
  };
}
