import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Button, Popover, PopoverHeader} from 'reactstrap';
import {BsFillPersonFill} from "react-icons/bs";
import {LiaRobotSolid} from "react-icons/lia";

import './EntityHighlight.css';

/**
 * Highlighted text span with a pop-over.
 * Used to highlight articles' named entities
 */
const EntityHighlight = (props) => {
    const {
        id,         // popover identifier
        word,       // exact text of the entity
        title,      // popover title
        content,    // popover content
        icons       // optional comma-separated list of types of icon to add, each is one of: human, computed
    } = props;

    const [popoverOpen, setPopoverOpen] = useState(false);

    const toggle = () => setPopoverOpen(!popoverOpen);

    let icon = []
    if (icons !== undefined) {
        if (icons.includes("human"))
            icon.push(<BsFillPersonFill/>);
        if (icons.includes("computed"))
            icon.push(<LiaRobotSolid/>);
    }

    return (
        <span className="entity">
            <Button id={id} type="button" className="btn highlight-entity">
                {word} {icon}
            </Button>
            {content !== undefined ?
                <Popover placement="auto" isOpen={popoverOpen} target={id} toggle={toggle}>
                    <PopoverHeader> {title} </PopoverHeader>
                    <div className="popoverContent">
                        {content}
                    </div>
                </Popover>
                :
                null
            }
        </span>
    );
}

EntityHighlight.propTypes = {
    id: PropTypes.string.isRequired,
    word: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.array,
    icons: PropTypes.string
}

export default EntityHighlight;
