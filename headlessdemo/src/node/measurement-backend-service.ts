import { Emitter, Event } from "@theia/core";
import { Sensor } from "../sensing";
import { Measurement } from "../common/measurement-service";
import { injectable } from "@theia/core/shared/inversify";

@injectable()
export class MeasurementBackendService {
    protected readonly onDidMeasureEmitter = new Emitter<Measurement[]>;
    onDidMeasure: Event<Measurement[]> = this.onDidMeasureEmitter.event;

    protected readonly sensors = new Map<string, Sensor>();
    protected nextSensorId = 1;
    protected lastMeasurements: Measurement[] = [];

    registerSensor(sensor: Sensor): string {
        const id = `${this.nextSensorId++}`;
        this.sensors.set(id, sensor);
        return id;
    }

    unregisterSensor(id: string): void {
        this.sensors.delete(id);
    }

    async measureAll(): Promise<void> {
        const measurements = [];
        for (const sensor of this.sensors.values()) {
            const value = await sensor.measure();
            measurements.push({ sensor, value });
        }
        this.lastMeasurements = measurements;
        this.onDidMeasureEmitter.fire(measurements);
    }

    getLastMeasurements(): Measurement[] {
        return this.lastMeasurements;
    }
}