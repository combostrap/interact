import type {Page} from "../../interact/pages/interactPage";
import type {ContextProps} from "../../interact/componentsProvider/contextProps.js";

/**
 * Set the isProsePage meta property
 * @param page - the page
 * @param context - the context
 */
export function addProseIfNotDefined(page: Page, context: ContextProps) {

    // Note: the isProsePage property cannot be on the frontmatter because programmatic page
    // are module, and they are sealed (ie we can't modify any exported data)
    // Trying to modify the frontmatter props would get you TypeError: Cannot set property frontmatter of [object Module] which has only a getter

    if (page.frontmatter?.prose != null) {
        // content takes precedence
        context.meta.isProsePage = page.frontmatter.prose;
        return;
    }

    // May have been modified by a plugin
    if (context.meta.isProsePage != null) {
        return;
    }

    // Default
    context.meta.isProsePage = true;

}