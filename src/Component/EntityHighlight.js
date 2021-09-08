import React, {useState} from 'react';
import {Button, Popover, PopoverHeader, PopoverBody} from 'reactstrap';
import wikiLogo from './images/wiki.png';
import './EntityHighlight.css';

/**
 * Highlighted text span with pop-over
 * @param  id: pop-over identifier, title, entityLabel, entityUri
 * @returns {*}
 * @constructor
 */
const EntityHighlight = (props) => {
    const [popoverOpen, setPopoverOpen] = useState(false);

    const toggle = () => setPopoverOpen(!popoverOpen);

    return (
        <span className="entity">
            <Button id={props.id} type="button" className="btn highlight-entity">
                {props.word}
            </Button>
            <Popover placement="auto" isOpen={popoverOpen} target={props.id} toggle={toggle}>
                {/* <PopoverHeader> {props.title} </PopoverHeader>
                <PopoverBody> {props.content} </PopoverBody>*/}
                <div className="linkContent">
                    <a href={props.entityUri} target="_external_entity">
                        <span className="imgLink"><img src={wikiLogo} alt="Wikidata logo"/> </span>
                        <span>{props.entityLabel}</span>
                    </a>
                </div>
            </Popover>
        </span>
    );
}

export default EntityHighlight;