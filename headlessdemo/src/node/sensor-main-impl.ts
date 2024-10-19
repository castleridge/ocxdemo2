import { Event } from "@theia/core";
import { SENSOR_EXT, SensorExt, SensorMain } from "../common/rpc-api";
import { Emitter } from "@theia/core/shared/vscode-languageserver-protocol";
import { RPCProtocol } from "@theia/plugin-ext/lib/common/rpc-protocol";
import { inject, injectable } from "@theia/core/shared/inversify";
import { Measurement } from "../common/measurement-service";
import { MeasurementBackendService } from "./measurement-backend-service";

@injectable()
export class SensorMainImpl implements SensorMain {

    @inject(MeasurementBackendService)
    protected readonly measurementBackendService: MeasurementBackendService;
    
    constructor(@inject(RPCProtocol) rpc: RPCProtocol) {
        this.extProxy = rpc.getProxy(SENSOR_EXT);
    }

    protected extProxy: SensorExt;

    protected readonly onDidMeasureEmitter = new Emitter<Measurement[]>;
    onDidMeasure: Event<Measurement[]>= this.onDidMeasureEmitter.event;
        
    async $registerSensor(label: string, unit: string): Promise<string> {
        const id=  this.measurementBackendService.registerSensor({
            label: label,
            unit: unit,
            measure: () => {
                return this.extProxy.$measure(id);
            }
        });
        return id;
    }

    async $unregisterSensor(id: string): Promise<void> {
        this.measurementBackendService.unregisterSensor(id);
    }
} 