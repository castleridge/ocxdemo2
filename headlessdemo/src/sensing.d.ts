export type Destructor = () => void;

export interface Sensor {
    label: string;
    unit: string;
    measure(): Promise<string>;
}

export function registerSensor(sensor: Sensor): Promise<Destructor>;