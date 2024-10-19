import { createProxyIdentifier } from '@theia/plugin-ext/lib/common/rpc-protocol';

export const SENSOR_MAIN = createProxyIdentifier<SensorMain>('SensorMain');
export const SENSOR_EXT = createProxyIdentifier<SensorExt>('SensorExt');

export const SensorMain = Symbol('SensorExt');
export const SensorExt = Symbol('SensorExt');

export interface SensorMain {
    $registerSensor(label: string, unit: string): Promise<string>;
    $unregisterSensor(id: string): Promise<void>;
}

export interface SensorExt {
    $measure(sensorId: string): Promise<string>;
}