import type { ValidationChecks } from 'langium';
import type { RobotLanguageAstType } from './generated/ast.js';
import type { RobotLanguageServices } from './robot-language-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: RobotLanguageServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.RobotLanguageValidator;
    const checks: ValidationChecks<RobotLanguageAstType> = {
       // Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class RobotLanguageValidator {

    // checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
    //     if (person.name) {
    //         const firstChar = person.name.substring(0, 1);
    //         if (firstChar.toUpperCase() !== firstChar) {
    //             accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
    //         }
    //     }
    // }

    // AcceptWeaver


}
