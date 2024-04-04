import { NodeOptions } from '@sentry/node';
import * as Bunyan from 'bunyan';
import { WriteStream } from 'fs';
import pino from 'pino';

export interface ILogger {
    fatal: (msg: string | object | Error, ...args: any[]) => void;
    error: (msg: string | object | Error, ...args: any[]) => void;
    warn: (msg: string | object | Error, ...args: any[]) => void;
    info: (msg: string | object | Error, ...args: any[]) => void;
    debug: (msg: string | object | Error, ...args: any[]) => void;
    trace: (msg: string | object | Error, ...args: any[]) => void;
    flush: () => Promise<void>;
}

export enum Level {
    FATAL = 'fatal',
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug',
    TRACE = 'trace',
}

export interface ICustomLoggerStream<StreamType = NodeJS.WriteStream | WriteStream> {
    level: Level;
    stream: StreamType;
    enabled: boolean;
}

export type IPinoLoggerOptions = {
    level: pino.LevelWithSilent;
    outputStreams?: ICustomLoggerStream<pino.DestinationStream>[];
    logFormatters?: Formatter[];
    usePinoSerialized?: boolean;
} & pino.LoggerOptions;

export type IBunyanLoggerOption = {
    level: Bunyan.LogLevel;
    outputStreams: ICustomLoggerStream[];
} & Bunyan.LoggerOptions;

export interface ISentryStreamOptions extends NodeOptions {
    dsn: string;
    enableDedupe?: boolean;
}

export interface IBaseLogObject {
    level: number;
    time: string | number;
    msg?: string;
    pid?: number;
    hostname?: string;
    name?: string;
    v?: number;
    [key: string]: any;
}
export interface IWithErrorLogObject extends IBaseLogObject {
    err?: IErrorObject;
}

export interface IFlatLogObject extends IBaseLogObject {
    type?: string;
    stack?: string;
    code?: number | string;
    req?: IPseudoRequest;
    user?: Object;
    payload?: any;
}

export interface IErrorObject extends Error {
    fingerprint?: string;
    type?: string;
    code?: number | string;
    req?: IPseudoRequest;
    user?: Object;
    payload?: any;
    [key: string]: any;
}

interface IPseudoRequest {
    headers: {
        [key: string]: string | string[];
    };
    query: {
        [key: string]: string | number;
    };
    body: any;
    path: string;
    cookies?: Object;
    ip?: string;
    url: string;
    secure: boolean;
    method?: string;
}

export interface IHandlerError extends IErrorObject {
    req: IPseudoRequest;
}

export interface ISentryBreadcrumb {
    message: string;
    category?: string;
    level: number;
    data?: object;
}

export type Formatter<T = any, U = any> = (msg: T) => U;
