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
import { MainPluginApiProvider } from '@theia/plugin-ext/lib/common/plugin-ext-api-contribution';
import { RPCProtocol } from '@theia/plugin-ext/lib/common/rpc-protocol';
import { inject, injectable } from '@theia/core/shared/inversify';
import { SENSOR_MAIN, SensorMain } from '../common/rpc-api';

@injectable()
export class SensorMainApiProvider implements MainPluginApiProvider {
    @inject(SensorMain)
    protected readonly sensorMain: SensorMain;

    initialize(rpc: RPCProtocol): void {
        rpc.set(SENSOR_MAIN, this.sensorMain);
    }
}
