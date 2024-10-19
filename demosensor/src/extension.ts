// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as sensing from 'headlessdemo';

const destructors: sensing.Destructor[] = [];

export async function activate() {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "demosensor" is now active!');
	const temperatureSensor: sensing.Sensor = {
		label: "Temperature",
		unit: '°C',
		measure: async () => {
			return `${Math.random()*10+15}`;
		}
	}
	destructors.push(await sensing.registerSensor(temperatureSensor));

	const humiditySensure: sensing.Sensor = {
		label: "Humidity",
		unit: '%',
		measure: async () => {
			return `${Math.random()*20+50}`;
		}
	}
	destructors.push(await sensing.registerSensor(humiditySensure));


}

// This method is called when your extension is deactivated
export function deactivate() {
	destructors.forEach(dest => dest());
}
