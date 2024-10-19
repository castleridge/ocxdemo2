import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { MessageService } from '@theia/core';
import { BaseWidget, Message } from '@theia/core/lib/browser';
import { Measurement, MeasurementService } from '../common/measurement-service';
import { MeasurementClientImpl } from './measurement-client';

let nextId = 1;

@injectable()
export class HeadlessDemoWidget extends BaseWidget {
    static readonly ID = 'headlessDemo:widget';
    static readonly LABEL = 'HeadlessDemo Widget';

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    @inject(MeasurementClientImpl)
    protected readonly measurementClient: MeasurementClientImpl;

    @inject(MeasurementService)
    protected readonly measurementService: MeasurementService;

    currentMeasurements: Measurement[] = [];
    protected content: HTMLDivElement;
    instanceId: number;

    constructor() {
        super();
        this.instanceId = nextId++;
    }

    @postConstruct()
    protected init(): void {
        this.measurementClient.onDidMeasure(measurements => {
            this.onDidMeasure(measurements);
        });
        this.doInit();
    }

    protected async doInit(): Promise<void> {
        this.id = HeadlessDemoWidget.ID;
        this.title.label = HeadlessDemoWidget.LABEL;
        this.title.caption = HeadlessDemoWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-window-maximize'; // example widget icon.
        this.currentMeasurements = await this.measurementService.getLastMeasurements();
        this.update();
    }

    protected onAfterAttach(msg: Message): void {
        super.onAfterAttach(msg);
        this.content = this.node.ownerDocument.createElement('div');
        this.node.append(this.content);
    }

    onUpdateRequest(msg: Message): void {
        this.content.innerHTML = '<h3>Measurements</H3>';
        if (this.currentMeasurements.length === 0) {
            this.content.append(this.node.ownerDocument.createTextNode('No measurements'));
        } else {
            for (const m of this.currentMeasurements) {
                const div = this.node.ownerDocument.createElement('div');
                div.append(`${m.sensor.label}: ${m.value}${m.sensor.unit}`);
                this.content.append(div);
            }
        }
    }

    onDidMeasure(measurements: Measurement[]): void {
        this.currentMeasurements = measurements;
        this.update();
        this.messageService.info('New Measurements Occurred');
    }
}
