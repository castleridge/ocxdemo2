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

import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { RPCProtocol } from '@theia/plugin-ext/lib/common/rpc-protocol';
import { Plugin } from '@theia/plugin-ext/lib/common/plugin-api-rpc';
import type * as sensing from '../sensing';
import { PluginContainerModule } from '@theia/plugin-ext/lib/plugin/node/plugin-container-module';
import { SensorExtImpl } from './sensor-ext-impl';
import { SENSOR_EXT, SensorExt } from '../common/rpc-api';

// This script is responsible for creating and returning the extension's
// custom API object when a plugin's module imports it. Keep in mind that
// all of the code here runs in the plugin-host node process, whether that
// be the backend host dedicated to some frontend connection or the single
// host for headless plugins, which is where the plugin itself is running.

type Sensing = typeof sensing;
const SensingApiFactory = Symbol('SensingApiFactory');

// Retrieved by Theia to configure the Inversify DI container when the plugin is initialized.
// This is called when the plugin-host process is forked.
export const containerModule = PluginContainerModule.create(({ bind, bindApiFactory }) => {
    bind(SensorExtImpl).toSelf().inSingletonScope();
    bind(SensorExt).toService(SensorExtImpl);
    bindApiFactory('headlessdemo', SensingApiFactory, SensingApiFactoryImpl);
});

// Creates the Greeting of the Day API object
@injectable()
class SensingApiFactoryImpl {
    @inject(RPCProtocol)
    protected readonly rpc: RPCProtocol;
    
    @inject(SensorExtImpl)
    protected readonly sensorExt: SensorExtImpl;

    @postConstruct()
    initialize(): void {
        this.rpc.set(SENSOR_EXT, this.sensorExt);
    }

    createApi(plugin: Plugin): Sensing {
        return {
            registerSensor: async (sensor: sensing.Sensor) => {
                return this.sensorExt.registerSensor(sensor);
            }
        }
    };
}
