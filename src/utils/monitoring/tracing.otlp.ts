import { Resource, detectResources } from '@opentelemetry/resources';
import { NodeTracerProvider, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { MeterProvider, PeriodicExportingMetricReader, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import * as opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { gitDetector } from 'opentelemetry-resource-detector-git';
import * as api from '@opentelemetry/api';
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks';
// import { dockerCGroupV1Detector } from '@opentelemetry/resource-detector-docker';

export async function setupAutoInstrumenting() {

  const exporter = new OTLPTraceExporter({
    url:  `${process.env.OTEL_COLLECTOR_URL}/v1/traces`
  });

  const resource = await detectResources({
    detectors: [gitDetector],
  });


  const contextManager = new AsyncHooksContextManager();
  contextManager.enable();
  api.context.setGlobalContextManager(contextManager);

  //////////////////////////////////////////////////////////////////
  // TRACE:
  const traceProvider = new NodeTracerProvider({
    resource: resource.merge(
      new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME,
      })
    ),
  });

  // export spans to console (useful for debugging)
  traceProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  // export spans to opentelemetry collector
  traceProvider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  traceProvider.register();

  //////////////////////////////////////////////////////////////////
  // METRICS:
  const metricExporter = new OTLPMetricExporter({
    url: `${process.env.OTEL_COLLECTOR_URL}/v1/metrics`,
    headers: {}, 
    concurrencyLimit: 1,
  });
  
  const meterProvider = new MeterProvider({
    resource: resource.merge(
      new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME,
      })
    ),
  });
  
  meterProvider.addMetricReader(new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 1000,
  }));
  
  meterProvider.addMetricReader(new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
    exportIntervalMillis: 1000,
  }));
  // Now, start recording data
  opentelemetry.api.metrics.setGlobalMeterProvider(meterProvider)
  const meter = meterProvider.getMeter('MetricFun');
  const counter = meter.createCounter('CounterFun');
  counter.add(10, { 'kif': 'ketab' });


  //////////////////////////////////////////////////////////////////
  const sdk = new opentelemetry.NodeSDK({
    traceExporter: exporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk
    .start()
    .then(() => {
      console.log("Tracing initialized");
    })
    .catch((error) => console.log("Error initializing tracing", error));

  process.on("SIGTERM", () => {
    sdk
      .shutdown()
      .then(() => console.log("Tracing terminated"))
      .catch((error) => console.log("Error terminating tracing", error))
      .finally(() => process.exit(0));
  });
}
