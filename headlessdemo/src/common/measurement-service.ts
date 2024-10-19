import { RpcServer } from "@theia/core";

export interface Sensor {
    label: string, 
    unit: string;
}

export interface Measurement {
    sensor: Sensor;
    value: string;
}

export const MEASUREMENT_SERVICE_PATH = '/measurements';

export interface MeasurementClient {
    measurementsOccurred(measurements: Measurement[]): void;
}

export const MeasurementService = Symbol('MeasurementService');

export interface MeasurementService extends RpcServer<MeasurementClient> {
    measure(): void;
    getLastMeasurements(): Promise<Measurement[]>;
}