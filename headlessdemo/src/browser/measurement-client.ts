import { injectable } from "@theia/core/shared/inversify";
import { Measurement, MeasurementClient } from "../common/measurement-service";
import { Emitter, Event } from "@theia/core";

@injectable()
export class MeasurementClientImpl implements MeasurementClient {

    protected readonly onDidMeasureEmitter = new Emitter<Measurement[]>;
    onDidMeasure: Event<Measurement[]>= this.onDidMeasureEmitter.event;

    measurementsOccurred(measurements: Measurement[]): void {
        this.onDidMeasureEmitter.fire(measurements);
    }

}