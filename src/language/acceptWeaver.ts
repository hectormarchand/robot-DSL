import { ValidationAcceptor, ValidationChecks } from "langium";
import { RobotLanguageServices } from "./robot-language-module.js";
import { RobotVisitor } from "./Visitor.js";
import * as InterfacesAST from "./generated/ast.js";
import * as ClassAST from "./Visitor.js";
import { RobotLanguageAstType } from "./generated/ast.js";

/**
 * Register custom validation checks.
 * TODO : Call this function in the language module.ts file (see registerValidationChecks(...);)
 */
export function weaveAcceptMethods(services: RobotLanguageServices) {
    const registry = services.validation.ValidationRegistry;
    const weaver = services.validation.RobotAcceptWeaver;
    registry.register(weaver.checks, weaver);
}

/**
 * TODO :
 * You must implement a weaving function for each concrete concept of the language.
 * you will also need to fill the check data structure to map the weaving function to the Type of node
 */
export class RobotAcceptWeaver {
    weaveArithmeticExpression(node : InterfacesAST.ArithmeticExpression, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotVisitor<InterfacesAST.ArithmeticExpression>) => {
            return visitor.visitArithmeticExpression(node as unknown as ClassAST.ArithmeticExpression);
        }
    }

    checks: ValidationChecks<RobotLanguageAstType> = {
        ArithmeticExpression : this.weaveArithmeticExpression
    };

}