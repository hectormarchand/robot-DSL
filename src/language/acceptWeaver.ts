import { ValidationAcceptor, ValidationChecks } from "langium";
import { RobotLanguageServices } from "./robot-language-module.js";
import { RobotVisitor } from "./Visitor.js";

/**
 * Register custom validation checks.
 * TODO : Call this function in the language module.ts file (see registerValidationChecks(...);)
 */
export function weaveAcceptMethods(services: RobotLanguageServices) {
    const registry = services.validation.ValidationRegistry;
    const weaver = services.validation.RoboMlAcceptWeaver;
    registry.register(weaver.checks, weaver);
}

/**
 * TODO :
 * You must implement a weaving function for each concrete concept of the language.
 * you will also need to fill the check data structure to map the weaving function to the Type of node
 */
export class RoboMlAcceptWeaver {
    weaveConcept(node : InterfaceAST.Concept, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotVisitor) => {return visitor.visitConcept(node as unknown as ClassAST.Concept);}
    }

    checks: ValidationChecks<RoboMlAstType> = {
        Concept : this.weaveConcept
    };

}