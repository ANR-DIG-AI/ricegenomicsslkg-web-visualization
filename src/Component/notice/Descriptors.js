import React, {useState, useEffect} from 'react';
import {BsFillPersonFill} from "react-icons/bs";
import {LiaRobotSolid} from "react-icons/lia";
import {useLocation} from 'react-router-dom';
import EntityHighlight from "./EntityHighlight";
import axios from "axios";
import {isEmptyResponse} from '../../Utils';
import {getClickableEntityLink} from "../../Utils";

// Get the list of KBs that we consider in the named entities and descriptors
import KB from "../../config/knowledge_bases.json";


/**
 * Formats the article's global descriptors (similar to named entities but not referring to a part of the text)
 */
const Descriptors = () => {

    const [listDescriptor, setListDescriptor] = useState([]);

    const articleUri = new URLSearchParams(useLocation().search).get("uri");

    useEffect(() => {
        let query = process.env.REACT_APP_BACKEND_URL + "/getArticleDescriptors/?uri=" + articleUri;
        if (process.env.REACT_APP_LOG === "on") {
            console.log("Will submit backend query: " + query);
        }
        axios(query).then(response => {
            if (!isEmptyResponse(query, response)) {
                let descriptors = [];

                // Filter out the URIs that are not in one of the accepted knowledge bases
                response.data.result.forEach(_descr => {
                    let kb = KB.find(_kb => _descr.entityUri.includes(_kb.namespace));
                    if (kb !== undefined) {
                        if (kb.used_for.some(usage => usage === "descriptor")) {
                            _descr.kbName = kb.name;
                            _descr.entityUri = getClickableEntityLink(_descr.entityUri);
                            descriptors.push(_descr);
                        }
                    }
                });
                if (process.env.REACT_APP_LOG === "on") {
                    console.log("------------------------- Retrieved " + descriptors.length + " descriptors.");
                    descriptors.forEach(e => console.log(e));
                }

                setListDescriptor(descriptors);
            }
        })
        //eslint-disable-next-line
    }, []);


    /**
     * Present a descriptor of the article as a highlighted text span with pop-over
     *
     * @param id : string pop-over identifier
     * @param descriptor : object data about the descriptor (uri, label associated with the uri if any)
     * @param result
     */
    function wrap(id, descriptor, result) {

        let content = [];

        // Display the label from the KB if we have it, otherwise simply the URI
        let entityLabel = descriptor.entityLabel;
        if (entityLabel === undefined) {
            entityLabel = descriptor.entityUri;
        }

        // Format the link, label and badge
        content.push(
            <div><a href={descriptor.entityUri} target="_external_entity">
                <span className="badge-kb">{descriptor.kbName}&nbsp;</span>
                <span className="entity-label">{entityLabel}</span>
            </a></div>
        );

        result.push(
            <EntityHighlight
                key={id}
                id={id}
                word={entityLabel}
                title={entityLabel}
                content={content}
                icons={descriptor.types}
            />
        );
        result.push(<span>&nbsp;</span>);
    }

    // ------------------------------------------------------------------------

    let thematicDescriptors = [];
    listDescriptor.forEach((_descr, _index) => {
        if (_descr.isGeographicalDescriptor === undefined || _descr.isGeographicalDescriptor === 0)
            wrap("word-desc-" + _index, _descr, thematicDescriptors);
    });

    let geographicDescriptors = [];
    listDescriptor.forEach((_descr, _index) => {
        if (_descr.isGeographicalDescriptor === 1)
            wrap("word-desc-" + _index, _descr, geographicDescriptors);
    });

    let result = [];
    if (thematicDescriptors.length > 0)
        result.push(
            <div>
                <div className="content_header">Thematic descriptors &nbsp;&nbsp;
                    <span className={"small"}>(<BsFillPersonFill/> manual, <LiaRobotSolid/> automatic)</span>
                </div>
                <div> {thematicDescriptors} </div>
                <div className="spacer">&nbsp;</div>
            </div>
        );

    if (geographicDescriptors.length > 0)
        result.push(
            <div>
                <div className="content_header">Geographic descriptors &nbsp;&nbsp;
                    <span className={"small"}>(<BsFillPersonFill/> manual, <LiaRobotSolid/> automatic)</span>
                </div>
                <div> {geographicDescriptors} </div>
            </div>
        );

    return (
        <div>
            <div className="component">
                {result}
            </div>
        </div>
    )
};

export default Descriptors;
