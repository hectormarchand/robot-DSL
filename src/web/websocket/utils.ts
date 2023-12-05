import { AstNode, LangiumDocument, URI } from "langium";
import { createRobotLanguageServices } from "../../language/robot-language-module.js";
import { NodeFileSystem } from "langium/node";

export async function createAstFromString<T extends AstNode>(content: string): Promise<T> {
    const services = createRobotLanguageServices(NodeFileSystem).RobotLanguage;
    const document = services.shared.workspace.LangiumDocumentFactory.fromString(content, URI.from({scheme:""}));
    await services.shared.workspace.DocumentBuilder.build([document], { validation: true });

    return document.parseResult.value as T;
}

export async function createDocumentFromString(content: string): Promise<LangiumDocument> {
    const services = createRobotLanguageServices(NodeFileSystem).RobotLanguage;
    const document = services.shared.workspace.LangiumDocumentFactory.fromString(content, URI.from({scheme:""}));
    await services.shared.workspace.DocumentBuilder.build([document], { validation: true });

    return document;
}