import { inject, injectable, postConstruct } from "@theia/core/shared/inversify";
import { SENSOR_MAIN, SensorExt, SensorMain } from "../common/rpc-api";
import { RPCProtocol } from '@theia/plugin-ext/lib/common/rpc-protocol';
import * as sensing from "../sensing";

@injectable()
export class SensorExtImpl implements SensorExt {

    @inject(RPCProtocol) 
    rpc: RPCProtocol;

    protected readonly sensors = new Map<string, sensing.Sensor>;

    protected mainProxy: SensorMain;
    
    @postConstruct()
    init(): void {
        this.mainProxy = this.rpc.getProxy(SENSOR_MAIN);
    }

    async $measure(sensorId: string): Promise<string> {
        const sensor = this.sensors.get(sensorId); 
        if (!sensor) {
            throw new Error(`No sensor found for id ${sensorId}`);
        }
        return sensor.measure();
    }

    async registerSensor(sensor: sensing.Sensor): Promise<sensing.Destructor> {
        const id = await this.mainProxy.$registerSensor(sensor.label, sensor.unit);
        this.sensors.set(id, sensor);
        return () => { 
            this.sensors.delete(id);
        };
    }
}