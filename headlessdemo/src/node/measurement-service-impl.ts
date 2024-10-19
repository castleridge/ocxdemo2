import { Measurement, MeasurementClient, MeasurementService } from "../common/measurement-service";
import { inject, injectable, postConstruct } from "@theia/core/shared/inversify";
import { Disposable } from "@theia/core";
import { MeasurementBackendService } from "./measurement-backend-service";

@injectable()
export class MeasurementServiceImpl implements MeasurementService {

    getClient?(): MeasurementClient | undefined {
        throw new Error("Method not implemented.");
    }
 
    @inject(MeasurementBackendService)
    protected readonly measurementBackendService: MeasurementBackendService;
    protected client: MeasurementClient | undefined;
    protected sensorRegistration: Disposable;

    @postConstruct()
    init(): void {
        this.sensorRegistration = this.measurementBackendService.onDidMeasure(measurements => {
            if (this.client) {
                this.client.measurementsOccurred(measurements);
            }
        });
    }

    measure(): void {
        this.measurementBackendService.measureAll();
    }

    async getLastMeasurements(): Promise<Measurement[]> {
        return this.measurementBackendService.getLastMeasurements();
    }
    
    dispose(): void {
        this.sensorRegistration.dispose();
    }

    setClient(client: MeasurementClient | undefined): void {
        this.client = client;
    }
}