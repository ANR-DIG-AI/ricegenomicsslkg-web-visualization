import React from 'react';
import PropTypes from 'prop-types';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import './SearchForm.css';

/**
 * Suggestion of an entity based on the user input.
 * In a suggestion, the part of text that corresponds to the current user input is highlighted.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const SuggestionEntity = (props) => {
    const {
        id,
        input,              // current value of the input field
        entityLabel,        // the label proposed by the auto-complete service for the current input
        entityUri,          // the URI of the entity/concept corresponding to the label
        entityPrefLabel,    // optional preferred label in case entityLabel is an alternate label
        entityCount,        // the number of documents that are annotated with this entity/concept
        entityType,         // where that entity comes from
        handleSelect
    } = props;

    /**
     * Split the entity label in pieces separated by the value of the current input.
     * Example: if the label is "banana supply chain" and input is "anan", then the result is:
     * [ "b", "anan", "a supply chain" ]
     *
     * @TODO make this function case-insensitive but keep case of suggestions (using String.search instead of String.split)
     *
     * @param {string} label
     * @param {string} input
     */
    const formatLabel = (label, input) => {
        let inputL = input.toLowerCase();
        let tokens = label.toLowerCase().split(inputL);
        let result = [];
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] !== "")
                result.push(tokens[i]);
            if (i < tokens.length - 1)
                // If this is not the last token it must be followed by the input
                result.push(inputL);
        }
        return result;
    }

    return (
        <ListGroup.Item key={id} className="suggestion-item" action  variant="light" onClick={() => handleSelect(id)}>
            <span>{entityLabel}</span>
            &nbsp;
            <span className={"suggestion-pref-label"}>{entityPrefLabel}</span>
            &nbsp;
            <span className={"suggestion-pref-label"}>[{entityType}]</span>
            &nbsp;
            <Badge bg="secondary">{entityCount}</Badge>
        </ListGroup.Item>
    );
}

SuggestionEntity.propTypes = {
    id: PropTypes.number.isRequired,
    input: PropTypes.string.isRequired,
    entityLabel: PropTypes.string.isRequired,
    entityUri: PropTypes.string.isRequired,
    entityPrefLabel: PropTypes.string,
    entityCount: PropTypes.string,
    entityType: PropTypes.string.isRequired,
    handleSelect: PropTypes.func.isRequired
}

export default SuggestionEntity;
