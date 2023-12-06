import type { Model } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { RobotLanguageLanguageMetaData } from '../language/generated/module.js';
import { createRobotLanguageServices } from '../language/robot-language-module.js';
import { extractAstNode } from './cli-util.js';
import { generateJavaScript, writeAst } from './generator.js';
import { NodeFileSystem } from 'langium/node';
import { interpret } from '../semantic/interpreter.js';
import { compile } from '../semantic/compiler.js';
import { createDocumentFromString } from '../web/websocket/utils.js';
import { wsServer } from '../web/app.js';

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

export const visitFile = async (fileName: string): Promise<void> => {
    const services = createRobotLanguageServices(NodeFileSystem).RobotLanguage;
    const model = await extractAstNode<Model>(fileName, services);
    interpret(model);
}

export const compileCode = async (fileName: string): Promise<void> => {
    const services = createRobotLanguageServices(NodeFileSystem).RobotLanguage;
    const model = await extractAstNode<Model>(fileName, services);
    compile(model);
}

export const parseAndValidate = async (code: string): Promise<void> => {

    

    const contentToParse = await createDocumentFromString(code);

    const parseResult = contentToParse.parseResult;
    // verify no lexer, parser, or general diagnostic errors show up
    if (parseResult.lexerErrors.length === 0 && 
        parseResult.parserErrors.length === 0
    ) {

        console.log(chalk.green(`Parsed and validated successfully!`));
        wsServer.emitParsedAndValidated(true);
    } else {
        console.log(chalk.red(`Failed to parse and validate !`));
        wsServer.emitParsedAndValidated(false);
    }
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

    program
        .command("visitFile")
        .argument('<file>', `Source file ending in ${fileExtensions}`)
        .description('Command to generate the AST of a source file')
        .action(visitFile)

    program.parse(process.argv);
}
