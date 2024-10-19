import { ContainerModule } from '@theia/core/shared/inversify';
import { HeadlessDemoWidget } from './headlessDemo-widget';
import { HeadlessDemoContribution } from './headlessDemo-contribution';
import { bindViewContribution, FrontendApplicationContribution, RemoteConnectionProvider, ServiceConnectionProvider, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';
import { MEASUREMENT_SERVICE_PATH, MeasurementService } from '../common/measurement-service';
import { MeasurementClientImpl } from './measurement-client';

export default new ContainerModule(bind => {
    bindViewContribution(bind, HeadlessDemoContribution);
    bind(FrontendApplicationContribution).toService(HeadlessDemoContribution);
    bind(HeadlessDemoWidget).toSelf();
    bind(MeasurementClientImpl).toSelf().inSingletonScope();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: HeadlessDemoWidget.ID,
        createWidget: () => ctx.container.get<HeadlessDemoWidget>(HeadlessDemoWidget)
    })).inSingletonScope();

     bind(MeasurementService).toDynamicValue(ctx => {
        const connection = ctx.container.get<ServiceConnectionProvider>(RemoteConnectionProvider);
        return connection.createProxy<MeasurementService>(MEASUREMENT_SERVICE_PATH, ctx.container.get(MeasurementClientImpl));
    }).inSingletonScope();
});
