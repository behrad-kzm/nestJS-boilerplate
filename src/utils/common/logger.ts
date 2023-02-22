import axios from "./axios";

export class Logger {
  static async logResponseError(
    { exception, status, url, body, isCritical = false, message, code }:
    { exception?: any, status: number, url?: string, body?: any, isCritical?: boolean, message?: string, code?: string}
  ) {
    // await axios({
    //   method: 'post',
    //   url: process.env.TELEGRAM_CRITICAL_ERROR_WEBHOOK || 'test',
    //   data: {
    //     chat_id: process.env.TELEGRAM_CHANNEL_ID || -1,
    //     text: `error: ${JSON.stringify(
    //       {
    //         isCritical,
    //         timestamp: new Date().toISOString(),
    //         url,
    //         status,
    //         message,
    //         code,
    //         exception,
    //         body,
    //       },
    //     )}`,
    //   },
    // });
  }

  static async logError(
    { error, message, isCritical = false, functionName, metaInfo }:
    { error: Error, isCritical?: boolean, message?: string, functionName?: string, metaInfo?: any}
  ) {
    
    // await axios({
    //   method: 'post',
    //   url: process.env.TELEGRAM_CRITICAL_ERROR_WEBHOOK || 'test',
    //   data: {
    //     chat_id: process.env.TELEGRAM_CHANNEL_ID || -1,
    //     text: `error: ${JSON.stringify(
    //       {
    //         isCritical,
    //         timestamp: new Date().toISOString(),
    //         metaInfo,
    //         functionName,
    //         message,
    //       },
    //     )}`,
    //   },
    // });
  }
}
