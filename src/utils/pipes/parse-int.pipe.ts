import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { AppError } from "../common/app-error";

@Injectable()
export class ParseOptionalIntPipe implements PipeTransform<string | undefined> {
  transform(value: string, metadata: ArgumentMetadata) {
    const convertedVariable = parseFloat(value)

    if (!isNaN(convertedVariable)) {
      return parseFloat(value);
    }

    if (value === undefined || isNaN(convertedVariable)) {
      return undefined;
    }

    throw AppError({
      status: 400,
      messages: [
        {
          message: `${metadata.data} must be Int value.`,
          identifier: `validation.invalidParameter.${metadata.data}`,
        }
      ]
    })
  }
}

@Injectable()
export class ParseRequiredIntPipe implements PipeTransform<string | undefined> {
  transform(value: string, metadata: ArgumentMetadata) {
    const convertedVariable = parseFloat(value)

    if (!isNaN(convertedVariable)) {
      return parseFloat(value);
    }

    if (value === undefined || isNaN(convertedVariable)) {
      throw AppError({
        status: 400,
        messages: [
          {
            message: `${metadata.data} should not be empty`,
            identifier: `validation.invalidParameter.${metadata.data}`,
          }
        ]
      });
    }

    throw AppError({
      status: 400,
      messages: [
        {
          message: `${metadata.data} must be Int value.`,
          identifier: `validation.invalidParameter.${metadata.data}`,
        }
      ]
    })
  }
}
