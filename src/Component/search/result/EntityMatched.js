import PropTypes from 'prop-types';
import {Button} from 'reactstrap';
import '../SearchForm.css';
import {getClickableEntityLink} from "../../../Utils";

/**
 * Highlight a named entity with link to the reference vocabulary
 */
const EntityMatched = (props) => {
    const {
        id,
        label,
        link,
        type
    } = props;

    let classes = "btn highlight-entities ";
    if (type === "Taxon")
        classes += "entity-box-bg1";
    else if (type === "Gene")
        classes += "entity-box-bg2";
    else if (type === "Phenotype or trait")
        classes += "entity-box-bg3";
    else if (type === "Variety")
        classes += "entity-box-bg4";
    else classes += "entity-box-bg1";

    return (
        <span className="entity">
            <Button id={id} type="button" className={classes}>
                <a className="entity-link" href={getClickableEntityLink(link)} target="_external_entity">
                    {label}
                </a>
            </Button>
        </span>
    );
}

EntityMatched.propTypes = {
    id: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
}

export default EntityMatched;
