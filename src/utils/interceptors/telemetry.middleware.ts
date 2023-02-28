import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as opentelemetry from '@opentelemetry/sdk-node';

@Injectable()
export class TelemetryMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const ctx = opentelemetry.api.context.active();
        const key = opentelemetry.api.createContextKey("My-Custom-Context-Key");
        console.log(opentelemetry.api.context.active().getValue(key));
        opentelemetry.api.trace.getActiveSpan().addEvent(
            "APMFUN"
        );
        
        const counter = opentelemetry.api.metrics.getMeter("MetricFun").createCounter("CounterFun");
        counter.add(50, { 'kif2': 'ketab2' });

        opentelemetry.api.context.with(ctx.setValue(key, 'Chert-Value'), async () => {
            const key = opentelemetry.api.createContextKey("My-Custom-Context-Key");
            console.log("inner", opentelemetry.api.context.active().getValue(key));
            let tracer = opentelemetry.api.trace.getTracer('app-name');

            let span = tracer.startSpan(
                "Service Execution",
                {
                    attributes: {},
                },
                opentelemetry.api.context.active(),
            );

            // Set the created span as active in the deserialized context.
            opentelemetry.api.trace.setSpan(opentelemetry.api.context.active(), span);
            span.setAttribute('route', req.url);
            span.addEvent("Birthdate",{"attr": "gole mohammadi"})
            
            next();
            span.end()
        });
  }
}
