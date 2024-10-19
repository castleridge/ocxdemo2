// *****************************************************************************
// Copyright (C) 2024 EclipseSource and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************
import { ContainerModule } from '@theia/core/shared/inversify';
import { ConnectionContainerModule } from '@theia/core/lib/node/messaging/connection-container-module';
import { ExtPluginApiProvider } from '@theia/plugin-ext';
import { MainPluginApiProvider } from '@theia/plugin-ext/lib/common/plugin-ext-api-contribution';
import { SensorApiProvider } from './sensor-api-provider';
import { SensorMainApiProvider } from './sensor-main-api-provider';
import { SensorMain } from '../common/rpc-api';
import { SensorMainImpl } from './sensor-main-impl';
import { MEASUREMENT_SERVICE_PATH, MeasurementService, MeasurementClient } from '../common/measurement-service';
import { MeasurementBackendService } from './measurement-backend-service';
import { MeasurementServiceImpl } from './measurement-service-impl';

const measurementConnectionModule = ConnectionContainerModule.create(({ bind, bindBackendService }) => {
    bind(MeasurementService).to(MeasurementServiceImpl).inSingletonScope();
    bindBackendService<MeasurementService, MeasurementClient>(MEASUREMENT_SERVICE_PATH, MeasurementService, (server, client) => {
        server.setClient(client);
        client.onDidCloseConnection(() => server.dispose());
        return server;
    });
});


export default new ContainerModule(bind => {
    bind(ConnectionContainerModule).toConstantValue(measurementConnectionModule);
    bind(Symbol.for(ExtPluginApiProvider)).to(SensorApiProvider).inSingletonScope();
    bind(MainPluginApiProvider).to(SensorMainApiProvider).inSingletonScope();
    bind(MeasurementBackendService).toSelf().inSingletonScope();
    bind(SensorMain).to(SensorMainImpl).inSingletonScope();
    bind
});
