import KB from "./config/knowledge_bases.json";

/**
 * Check whether the response from one of the backend services is empty.
 *
 * @param query the query string submitted to the backend
 * @param response
 * @returns {boolean} true if empty, false otherwise
 */
export function isEmptyResponse(query, response) {

    if (response.data === undefined || response.data.result === undefined) {
        console.log("WARNING: incomplete response\n: " + JSON.stringify(response) + " . Query was\n: " + query);
        return true;
    }
    if (response.data.result.length === 0) {
        console.log("Empty response.data.result\n: " + JSON.stringify(response) + " . Query was: " + query);
        return true;
    } else if (response.data.result[0] === undefined) {
        console.log("WARNING: response.data.result[0] undefined\n: " + JSON.stringify(response) + " . Query was: " + query);
        return true;
    } else if (Object.entries(response.data.result[0]).length === 0) {
        console.log("WARNING: empty response.data.result[0]\n: " + JSON.stringify(response) + " . Query was: " + query);
        return true;
    }

    return false;
}

/**
 * Checks the list of know knowedlegde bases (reference vocabularies) and turns the URI of a concept
 * into a clickable HTML link. The result may be the same URI or a technical URI meant to dereference terms
 * from a given vocabulary
 *
 * @param {string} entityUri - URI of a named entity in a reference vocabulary
 * @return {*} formatted URI to be used in an HTML anchor
 */
export function getClickableEntityLink(entityUri) {
    let kb = KB.find(_kb => entityUri.includes(_kb.namespace));
    if (kb !== undefined) {
        if (kb.dereferencing_template === undefined)
            return entityUri;
        else
            // Rewrite the link with the template given for that KB
            return kb.dereferencing_template.replace("{uri}", encodeURIComponent(entityUri));
    }
}