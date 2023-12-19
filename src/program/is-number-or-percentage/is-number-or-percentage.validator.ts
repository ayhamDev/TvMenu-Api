// is-number-or-percent-string.validator.ts
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "isNumberOrPercentage", async: false })
export class IsNumberOrPercentStringConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any) {
    if (typeof value === "string") {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        return true; // It's a numeric string
      }

      if (value.endsWith("%")) {
        const numericPercentageValue = parseFloat(value.slice(0, -1));
        if (!isNaN(numericPercentageValue)) {
          return true; // It's a numeric percentage string
        }
      }
    }

    return false;
  }

  defaultMessage(validationArguments: ValidationArguments) {
    const propertyName = validationArguments.property;

    return `${propertyName} must be either Numeric String or Percentage String`;
  }
}
