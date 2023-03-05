import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as opentelemetry from '@opentelemetry/sdk-node';
function generateNumber(min: number, max: number) {
    if (min > max) {
        throw new Error('Minimum value should be smaller than maximum value.');
    }
    var range = max - min;
    return min + range * Math.random();
};

function calculateFunJokes(result: opentelemetry.api.ObservableResult) {

    result.observe(generateNumber(1,2), {
        jokeName: "programming jokes"
    });

    result.observe(generateNumber(10,25), {
        jokeName: "family jokes"
    });

    result.observe(generateNumber(100,250), {
        jokeName: "+18 jokes"
    });
}

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


        const randomizedGauge = opentelemetry.api.metrics.getMeter("MetricFun").createObservableGauge("GaugeFun", {
            description: "this gauge made for fun",
            unit: "liter",
            valueType: opentelemetry.api.ValueType.DOUBLE,
        });
        randomizedGauge.addCallback(calculateFunJokes)

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

