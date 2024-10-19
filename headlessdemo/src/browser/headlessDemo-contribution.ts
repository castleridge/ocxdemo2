import { inject, injectable } from '@theia/core/shared/inversify';
import { MenuModelRegistry } from '@theia/core';
import { HeadlessDemoWidget } from './headlessDemo-widget';
import { AbstractViewContribution } from '@theia/core/lib/browser';
import { Command, CommandRegistry } from '@theia/core/lib/common/command';
import { MeasurementService } from '../common/measurement-service';

export const OpenViewCommand: Command = { id: 'headlessDemo:openView', label: `Open Headless Demo Widget` };
export const MesasureCommand: Command = { id: 'headlessDemo:measure', label: `Measure Some Values` };

@injectable()
export class HeadlessDemoContribution extends AbstractViewContribution<HeadlessDemoWidget> {

    @inject(MeasurementService)
    protected readonly measurementService: MeasurementService;

    constructor() {
        super({
            widgetId: HeadlessDemoWidget.ID,
            widgetName: HeadlessDemoWidget.LABEL,
            defaultWidgetOptions: { area: 'left' },
            toggleCommandId: OpenViewCommand.id
        });
    }

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(OpenViewCommand, {
            execute: () => super.openView({ activate: false, reveal: true })
        });

        commands.registerCommand(MesasureCommand, {
            execute: () => {
                this.measurementService.measure();
            }
        })
    }

    registerMenus(menus: MenuModelRegistry): void {
        super.registerMenus(menus);
    }
}
