import PropTypes from 'prop-types';
import './SearchForm.css';
import {getClickableEntityLink} from "../../Utils";
import React from "react";

const SearchEntity = (props) => {
    const {
        id,
        entityUri,
        entityLabel,
        entityPrefLabel,    // optional preferred label in case entityLabel is an alternate label
        entityType,
        handleRemove
    } = props;

    let classes = "entity-box ";
    if (entityType === "Taxon")
        classes += "entity-box-bg1";
    else if (entityType === "Gene")
        classes += "entity-box-bg2";
    else if (entityType === "Phenotype or trait")
        classes += "entity-box-bg3";
    else if (entityType === "Variety")
        classes += "entity-box-bg4";
    else classes += "entity-box-bg1";

    return (
        <div className={classes} key={id}>
            <div>
                <a className="entity-link" href={getClickableEntityLink(entityUri)} target="_external_entity">
                    {entityLabel}
                </a>
            </div>
            <button className="entity-remove-button" onClick={() => handleRemove(id)}>
                &times;
            </button>
        </div>
    );
}

SearchEntity.propTypes = {
    id: PropTypes.number.isRequired,
    entityUri: PropTypes.string.isRequired,
    entityLabel: PropTypes.string.isRequired,
    entityPrefLabel: PropTypes.string,
    entityType: PropTypes.string.isRequired,
    handleRemove: PropTypes.func.isRequired
}

export default SearchEntity;
