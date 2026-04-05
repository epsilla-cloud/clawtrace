import { n as VERSION } from "./version-CIMrqUx3.js";
import { t as getCoreCliCommandDescriptors } from "./core-command-descriptors-CGEppuUI.js";
import { n as getSubCliEntries } from "./subcli-descriptors-DmK47MUb.js";
import { t as configureProgramHelp } from "./help-0Rgp1tTO.js";
import { Command } from "commander";
//#region src/cli/program/root-help.ts
function buildRootHelpProgram() {
	const program = new Command();
	configureProgramHelp(program, {
		programVersion: VERSION,
		channelOptions: [],
		messageChannelOptions: "",
		agentChannelOptions: ""
	});
	const existingCommands = /* @__PURE__ */ new Set();
	for (const command of getCoreCliCommandDescriptors()) {
		program.command(command.name).description(command.description);
		existingCommands.add(command.name);
	}
	for (const command of getSubCliEntries()) {
		if (existingCommands.has(command.name)) continue;
		program.command(command.name).description(command.description);
		existingCommands.add(command.name);
	}
	return program;
}
function renderRootHelpText() {
	const program = buildRootHelpProgram();
	let output = "";
	const originalWrite = process.stdout.write.bind(process.stdout);
	const captureWrite = ((chunk) => {
		output += String(chunk);
		return true;
	});
	process.stdout.write = captureWrite;
	try {
		program.outputHelp();
	} finally {
		process.stdout.write = originalWrite;
	}
	return output;
}
function outputRootHelp() {
	process.stdout.write(renderRootHelpText());
}
//#endregion
export { outputRootHelp };
