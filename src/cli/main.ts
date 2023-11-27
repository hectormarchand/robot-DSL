import type { Model } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { RobotLanguageLanguageMetaData } from '../language/generated/module.js';
import { createRobotLanguageServices } from '../language/robot-language-module.js';
import { extractAstNode } from './cli-util.js';
import { generateJavaScript, writeAst } from './generator.js';
import { NodeFileSystem } from 'langium/node';

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createRobotLanguageServices(NodeFileSystem).RobotLanguage;
    const model = await extractAstNode<Model>(fileName, services);
    const generatedFilePath = generateJavaScript(model, fileName, opts.destination);
    console.log(chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`));
};

export const generateAST = async (fileName: string): Promise<void> => {
    const services = createRobotLanguageServices(NodeFileSystem).RobotLanguage;
    const model = await extractAstNode<Model>(fileName, services);
    const generatedFilePath = writeAst(model, "output");
    console.log(chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`));
}

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .version(require('../../package.json').version);

    const fileExtensions = RobotLanguageLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generateAST')
        .argument('<file>', `Source file ending in ${fileExtensions}`)
        .description('Command to generate the AST of a source file')
        .action(generateAST);

    program.parse(process.argv);
}
