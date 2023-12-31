import type { DefaultSharedModuleContext, LangiumServices, LangiumSharedServices, Module, PartialLangiumServices } from 'langium';
import { createDefaultModule, createDefaultSharedModule, inject } from 'langium';
import { RobotLanguageGeneratedModule, RobotLanguageGeneratedSharedModule } from './generated/module.js';
import { RobotLanguageValidator, registerValidationChecks } from './robot-language-validator.js';
import { RoboMlAcceptWeaver, weaveAcceptMethods } from './accept-weaver.js';

/**
 * Declaration of custom services - add your own service classes here.
 */
export type RobotLanguageAddedServices = {
    validation: {
        RobotLanguageValidator: RobotLanguageValidator
        RobotAcceptWeaver: RoboMlAcceptWeaver
    }
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type RobotLanguageServices = LangiumServices & RobotLanguageAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const RobotLanguageModule: Module<RobotLanguageServices, PartialLangiumServices & RobotLanguageAddedServices> = {
    validation: {
        RobotLanguageValidator: () => new RobotLanguageValidator(),
        RobotAcceptWeaver: () => new RoboMlAcceptWeaver()
    }
};

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createRobotLanguageServices(context: DefaultSharedModuleContext): {
    shared: LangiumSharedServices,
    RobotLanguage: RobotLanguageServices
} {
    const shared = inject(
        createDefaultSharedModule(context),
        RobotLanguageGeneratedSharedModule
    );
    const RobotLanguage = inject(
        createDefaultModule({ shared }),
        RobotLanguageGeneratedModule,
        RobotLanguageModule
    );
    shared.ServiceRegistry.register(RobotLanguage);
    registerValidationChecks(RobotLanguage);
    weaveAcceptMethods(RobotLanguage);
    return { shared, RobotLanguage };
}
