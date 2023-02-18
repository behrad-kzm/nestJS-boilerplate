import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { AppError } from "../common/app-error";

@Injectable()
export class ParseOptionalDatePipe implements PipeTransform<string | undefined, Date | undefined> {
    transform(value: string, metadata: ArgumentMetadata) {
        const date = Date.parse(value);
        console.log(date)
        if (!isNaN(date)) {
          return new Date(value);
        }

        if( value === undefined || isNaN(date)) {
          return undefined;
        }

        throw AppError({
          status: 400,
          messages: [
            {
              message: `${metadata.data} must be Date value.`,
              identifier: `validation.invalidParameter.${metadata.data}`,
            }
          ]
        })
    }
}
@Injectable()
export class ParseRequiredDatePipe implements PipeTransform<string | undefined, Date> {
    transform(value: string, metadata: ArgumentMetadata) {
        const date = Date.parse(value);

        if (!isNaN(date)) {
          return new Date(value);
        }

        if(value === undefined || isNaN(date)) {
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
              message: `${metadata.data} must be Date value.`,
              identifier: `validation.invalidParameter.${metadata.data}`,
            }
          ]
        })
    }
}
