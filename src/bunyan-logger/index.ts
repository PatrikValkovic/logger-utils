import * as Bunyan from 'bunyan';
import { BunnyanSerializers } from '../bunyan-serializers';
import { IBunyanLoggerOption, ICustomLoggerStream, ILogger } from '../interfaces';

export class BunyanLogger extends Bunyan implements ILogger {
    private readonly streams: ICustomLoggerStream[];
    constructor(options: IBunyanLoggerOption) {
        const { outputStreams, ...bunyanOptions } = options;
        super({
            streams: outputStreams.filter((stream) => stream.enabled === true),
            serializers: BunnyanSerializers.stdSerializers(),
            ...bunyanOptions,
        });
        this.streams = outputStreams;
    }

    async flush(): Promise<void> {
        await Promise.all(this.streams.map((stream) => new Promise<void>((resolve) => stream.stream.end(resolve))));
    }
}
