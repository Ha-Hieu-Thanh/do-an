import { UnprocessableEntity } from '@app/core/exception';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { isString } from 'lodash';
import * as moment from 'moment';
// Ex: 2021-06-19T00:00:00.000Z
const ISOStringRegex = new RegExp(
  '^\\d\\d\\d\\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])T(00|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9].[0-9][0-9][0-9])Z$',
);

/**
 * use: @Validate(CustomTextLength)
 */

@ValidatorConstraint({ name: 'customText', async: false })
export class CustomTextLength implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Text ($value) is too short or too long!';
  }
}

export function IsDateCustom(
  property?: { isCheckNow?: boolean; moreThanDate?: string },
  validationOptions?: ValidationOptions,
  metadata?: any,
): Function {
  return (object: Object, propertyName: string): void => {
    registerDecorator({
      name: 'IsDateCustom',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(date: string, params: ValidationArguments): boolean {
          if (!date || !isString(date)) return false;

          // const regEx = /^\d{4}-\d{2}-\d{2}$/;
          // regex for YYYY-MM-DD HH:mm
          const regEx = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

          if (!date.match(regEx)) return false; // Invalid format

          const d = new Date(date);
          const dNum = d.getTime();
          if (!dNum && dNum !== 0) return false; // NaN value, Invalid date

          const currentDate = new Date().getTime();
          if (property?.isCheckNow && dNum < currentDate) {
            return false;
          }

          if (property?.moreThanDate && date < property?.moreThanDate) {
            return false;
          }

          return true;
        },

        defaultMessage(args: ValidationArguments): string {
          return `${propertyName} Date is not valid`;
        },
      },
    });
  };
}

@ValidatorConstraint({ name: 'ISOString', async: false })
export class CustomISOString implements ValidatorConstraintInterface {
  validate(dateTimeString: string, args: ValidationArguments) {
    try {
      const isIOSString = ISOStringRegex.test(dateTimeString);
      const date = new Date(dateTimeString).toISOString();

      return isIOSString && date === dateTimeString;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `${args.property} must be ISOString `;
  }
}

@ValidatorConstraint({ name: 'IsDateCustom', async: false })
export class CustomValidateIsDate implements ValidatorConstraintInterface {
  validate(dateString: string, args: ValidationArguments) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false; // Invalid format

    const d = new Date(dateString);
    const dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date

    return d.toISOString().slice(0, 10) === dateString; // Checking leap day
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Date is format yyyy-mm-dd';
  }
}

@ValidatorConstraint({ name: 'IsNotEmail', async: false })
export class CustomValidateIsNotEmail implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const IsEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    return !IsEmailRegex.test(text);
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `${args.property} is not email`;
  }
}

@ValidatorConstraint({ name: 'IsPostCodeJv', async: false })
export class CustomValidateIsIsPostCodeJv implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const IsPostCodeJv = /^\d{3}-\d{4}$/;

    return IsPostCodeJv.test(text);
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `${args.property} format postcode jv xxx-xxxxx`;
  }
}

@ValidatorConstraint({ name: 'IsPassword', async: false })
export class CustomValidateIsPassword implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const IsPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z_@./!#$%^*()&+-]{8,}$/;

    return IsPassword.test(text);
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `${args.property} minimum of eight characters, at least one uppercase letter, one lowercase letter, and one number`;
  }
}

@ValidatorConstraint({ name: 'IsKatakana', async: false })
export class CustomValidateIsIsKatakana implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const IsKatakana = /^[\u30A0-\u30FFー　 _]+$/;

    return IsKatakana.test(text);
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `${args.property} format katakana`;
  }
}

/**
 * use: @IsLongerThan()
 */
export function IsLongerThan(property?: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLongerThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: CustomTextLength,
    });
  };
}

export function ArrayItemUnique(property: string, validationOptions?: ValidationOptions, metadata?: any): Function {
  return (object: Object, propertyName: string): void => {
    registerDecorator({
      name: 'ArrayItemUnique',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          if (Array.isArray(value)) {
            const distinct = value.filter((item) => item[property] === metadata[property]);
            return distinct.length === 1 || value.length === 0;
          }

          return false;
        },
        defaultMessage(args: ValidationArguments): string {
          return `${propertyName} there must be an item that has ${property} equal ${metadata[property]}`;
        },
      },
    });
  };
}

export function ArrayDistinct(property: string, validationOptions?: ValidationOptions): Function {
  return (object: Object, propertyName: string): void => {
    registerDecorator({
      name: 'ArrayDistinct',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          if (Array.isArray(value)) {
            const arrayNotId = value.filter((item) => item[property]);
            const distinct = [...new Set(arrayNotId.map((v): Object => v[property]))];
            return distinct.length === arrayNotId.length || distinct.length === 0;
          }

          return false;
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must not contains duplicate entry for ${args.constraints[0]}`;
        },
      },
    });
  };
}

export function IsParamsSort(property?: string[], validationOptions?: ValidationOptions): Function {
  return (object: Object, propertyName: string): void => {
    registerDecorator({
      name: 'IsParamsSort',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, target): boolean {
          try {
            return JSON.parse(value);
          } catch (error) {
            return false;
          }
        },

        defaultMessage(args: ValidationArguments): string {
          return `${args.property} Must be JSON`;
        },
      },
    });
  };
}

export function TransformParamsSort(data: string | any, property: string[]) {
  if (data) {
    data = JSON.parse(data);
    const keys = Object.keys(data);

    const ascending = 'ASC';
    const decrease = 'DESC';

    return keys.reduce((acc, cur) => {
      if (property.includes(cur)) {
        acc.push({ key: cur, value: data[cur] ? ascending : decrease });
      }
      return acc;
    }, [] as { key: string; value: 'ASC' | 'DESC' }[]);
  }

  return [];
}

@Injectable()
export class CustomParseIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const isNumeric = ['string', 'number'].includes(typeof value) && !isNaN(parseFloat(value)) && isFinite(value);

    if (!isNumeric) {
      throw new UnprocessableEntity('Validation failed (numeric string is expected)');
    }

    return parseInt(value, 10);
  }
}

@Injectable()
export class AssignPagingPipe implements PipeTransform {
  transform(value: any) {
    const pageIndex = Number(value.pageIndex) || 1;
    const pageSize = Number(value.pageSize) || 10;
    value.pageIndex = pageIndex;
    value.pageSize = pageSize;
    value.skip = (pageIndex - 1) * pageSize;
    return value;
  }
}

@Injectable()
export class AssignLoadMore implements PipeTransform {
  transform(value: any) {
    const pageSize = Number(value.pageSize) || 10;
    value.pageSize = pageSize;
    return value;
  }
}
