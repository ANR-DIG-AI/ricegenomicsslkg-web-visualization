import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import EntityHighlight from "./EntityHighlight";
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import {isEmptyResponse} from '../../Utils';
import {getClickableEntityLink} from "../../Utils";

// Get the list of KBs that we consider in the named entities
import KB from "../../config/knowledge_bases.json";

/**
 * Formats the article abstract with annotated named entities
 */
const Abstract = () => {

    const [articleAbstract, setArticleAbstract] = useState('');
    const [namedEntities, setEntities] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const articleUri = new URLSearchParams(useLocation().search).get("uri");
    let result = [];


    /**
     * Retrieve the text of the article abstract from the backend
     */
    useEffect(() => {
        let query = process.env.REACT_APP_BACKEND_URL + "/getArticleMetadata/?uri=" + articleUri;
        if (process.env.REACT_APP_LOG === "on") {
            console.log("Will submit backend query: " + query);
        }
        axios(query).then(response => {
            if (!isEmptyResponse(query, response)) {
                let abstract = response.data.result[0].abs;
                if (abstract === undefined) {
                    abstract = "";
                } else {
                    // Seems that some abstracts start with the term "Abstract" and that the named entities offset
                    // does not take it into account. This is a nasty workaround.
                    if (abstract.substring(0, 9).toLowerCase() === "abstract ") {
                        abstract = abstract.substr(9);
                    }
                }
                if (process.env.REACT_APP_LOG === "on") {
                    console.log("Retrieved abstract: " + abstract);
                }
                setArticleAbstract(abstract);
            }
        })
        //eslint-disable-next-line
    }, []);


    /**
     * Retrieve the list of named entities from the backend
     */
    useEffect(() => {
        let query = process.env.REACT_APP_BACKEND_URL + "/getAbstractNamedEntities/?uri=" + articleUri;
        if (process.env.REACT_APP_LOG === "on") {
            console.log("Will submit backend query: " + query);
        }
        axios(query).then(response => {
            if (!isEmptyResponse(query, response)) {

                // Filter out the URIs that are not in one of the accepted knowledge bases
                let entities = [];
                response.data.result.forEach(entity => {
                    let kb = KB.find(_kb => entity.entityUri.includes(_kb.namespace));
                    if (kb !== undefined) {
                        if (kb.used_for.some(usage => usage === "named_entity")) {
                            entity.entityUri = getClickableEntityLink(entity.entityUri);
                            entities.push(entity);
                        }
                    }
                });

                if (process.env.REACT_APP_LOG === "on") {
                    console.log("------------------------- Retrieved " + entities.length + " entities.");
                    entities.sort(sortByStartPos).forEach(e => console.log(e));
                }

                let processedEntities = processEntities(entities).sort(sortByStartPos);
                if (process.env.REACT_APP_LOG === "on") {
                    console.log("------------------------- Grouped same entities. Keeping " + processedEntities.length + " entities.");
                    processedEntities.forEach(e => console.log(e));
                }

                let noOverlap = removeOverlaps(removeOverlaps(removeOverlaps(processedEntities)));
                if (process.env.REACT_APP_LOG === "on") {
                    console.log("------------------------- Removed overlapping entities. Keeping " + noOverlap.length + " entities.");
                    noOverlap.forEach(e => console.log(e));
                }

                setEntities(noOverlap);
            }
        })
        //eslint-disable-next-line
    }, []);


    /**
     * Reformat the list of entities where the URIs/labels of the entities with the same text and startPos
     * are grouped in new fields entityUris and entityLabels.
     * Recompute the endPos.
     *
     * @example
     * The 2 entities:
     * { entityText: "SARS-CoV", startPos: 529, endPos: 537,
     *   entityUri: "http://www.wikidata.org/entity/Q85438966",
     *   entityLabel: "severe acute respiratory syndrome coronavirus" }
     * { entityText: "SARS-CoV", startPos: 529,
     *   entityUri: "http://dbpedia.org/resource/Severe_acute_respiratory_syndrome-related_coronavirus" }
     * will be grouped into:
     * { entityText: "SARS-CoV", startPos: 529, endPos: 537,
     *   entityUris: [ "http://www.wikidata.org/entity/Q85438966", "http://dbpedia.org/resource/Severe_acute_respiratory_syndrome-related_coronavirus" ],
     *   entityLabels: [ "severe acute respiratory syndrome coronavirus", "" ] }
     *
     * @param entities[]
     * @returns {entities[]}
     */
    function processEntities(entities) {

        //--- Turn entityUri into an array entityUris and entityLabel into an array entityLabels
        entities.forEach(e => {
            let uri = e.entityUri;
            e.entityUris = [uri];
            delete e.entityUri;

            e.entityLabels = [];
            if (e.entityLabel === undefined) {
                e.entityLabels.push("");
            } else {
                e.entityLabels.push(e.entityLabel);
            }
            delete e.entityLabel;

            // Compute or recompute endPos so that it always means the same thing: index of last character
            e.endPos = e.startPos + e.entityText.length - 1;
        });

        //--- Merge the URIs and labels for same entities (same position and same text)
        let entities2 = [];
        entities.forEach(e => {
            // Check if e already exists in entities2
            let index = entities2.findIndex(f =>
                f.entityText.toLowerCase() === e.entityText.toLowerCase() &&
                f.startPos === e.startPos);
            if (index === -1) {
                // First time: simply add it to entities2
                entities2.push(e);
            } else {
                // It already exists: merge the two lists of URIs and labels
                entities2[index].entityUris = e.entityUris.concat(entities2[index].entityUris);
                entities2[index].entityLabels = e.entityLabels.concat(entities2[index].entityLabels);
            }
        });

        return entities2;
    }


    /**
     * Check whether 2 subsequent entities overlap with each other.
     * If so, keep only the longest one.
     *
     * This method fails to detect cases where more than 2 subsequent entities do overlap.
     * Invoking it twice is sufficient to get rid of 3 subsequent overlapping entities, etc.
     * A bit brutal but effective unless we have higher number of subsequent overlapping entities.
     *
     * @param entities[]
     * @returns {entities[]}
     */
    function removeOverlaps(entities) {
        let entities2 = [];

        let idx = 0;
        while (idx < entities.length - 1) {
            let first = entities[idx];
            let second = entities[idx + 1];
            if (second.startPos > first.endPos) {
                // No overlap: keep the first and move on to the next one
                entities2.push(first);
                idx++;
                // if last loop, also keep the last one
                if (idx === entities.length - 1)
                    entities2.push(second);
            } else {
                // There is an overlap: keep only the longest one
                if (first.entityText.length > second.entityText.length) {
                    entities2.push(first);
                } else {
                    entities2.push(second);
                }
                // Pass 1 and skip one
                idx = idx + 2;
            }
        }

        return entities2;
    }


    /**
     * Turn the string "before word" into a string where "word" is an highlighted entity
     *
     * @param id span identifier
     * @param text full abstract text
     * @param begin start position of the "before" text
     * @param e the data about the named entity (uri, label associated with the uri, start and end positions)
     * @param result
     */
    function wrap(id, text, begin, e, result) {
        let before = text.substring(begin, e.startPos);
        let actualTextAtPos = text.substring(e.startPos, e.endPos + 1);

        let content = [];
        for (let i = 0; i < e.entityUris.length; i++) {

            // Find the knowledge base that the URI comes from to use its name as a badge
            let badge = "";
            KB.forEach(_kb => {
                if (e.entityUris[i].includes(_kb.namespace)) {
                    badge = _kb.name;
                }
            });

            // Display the label from the KB if we have it, otherwise simply the text of the named entity
            let entityLabel = e.entityLabels[i];
            if (entityLabel === "") {
                entityLabel = e.entityText;
            }

            // Format the link, label and badge
            content.push(
                <div><a href={e.entityUris[i]} target="_external_entity">
                    <span className="badge-kb">{badge}&nbsp;</span>
                    <span className="entity-label">{entityLabel}</span>
                </a></div>
            );
        }

        result.push(<span>{before}</span>);
        result.push(
            <EntityHighlight
                id={id}
                word={actualTextAtPos}
                title={e.entityText}
                content={content}
            />
        )
    }

    function sortByStartPos(a, b) {
        if (a.startPos < b.startPos) {
            return -1;
        }
        if (a.startPos > b.startPos) {
            return 1;
        }
        return 0;
    }

    function LoadingButton() {
        const handleClick = () => setLoading(true);
        const clickAgain = () => setLoading(false);
        return (
            <Button className="annotate-button" variant="secondary" onClick={isLoading ? clickAgain : handleClick}>
                {isLoading ? 'Hide named entities' : 'Show named entities'}
            </Button>
        );
    }

    // ------------------------------------------------------------------------

    let begin = 0;
    for (let i = 0; i < namedEntities.length; i++) {
        wrap("word-" + i, articleAbstract, begin, namedEntities[i], result);
        begin = namedEntities[i].endPos + 1;
    }
    let r = articleAbstract.substring(begin);
    result.push(<span>{r}</span>);

    return (
        <div className="component">
            <div className="content_header">Abstract</div>
            {isLoading ? result : articleAbstract}
            <LoadingButton/>
        </div>
    );
};

export default Abstract;