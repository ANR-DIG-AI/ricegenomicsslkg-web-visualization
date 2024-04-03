import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { HiOutlineDocumentMagnifyingGlass } from "react-icons/hi2";
import EntityMatched from "./EntityMatched";
import './SearchResult.css';

/**
 * Represent a single article that was returned by the search action
 */
const SearchResult = (props) => {
    const {
        document,
        title,
        authors,
        date,
        publisher,
        lang,
        matchedEntities
    } = props;

    const [firstAuthors, setFirstAuthors] = useState('');

    const [matchedEntitiesDisplay, setMatchedEntitiesDisplay] = useState([]);

    // Limit the number of authors displayed
    const maxAuthors = 3;

    /**
     * Format the list of authors by limiting the total number
     * and adding [...] at the end if needed
     */
    useEffect(() => {
        let _firstAuthors = "";
        authors.forEach((_a, _index) => {
            if (_index === 0)
                _firstAuthors = _a;
            else if (_index < maxAuthors) {
                _firstAuthors += ', ' + _a;
            }
        })
        if (authors.length > maxAuthors) {
            _firstAuthors += ' [...]';
        }
        setFirstAuthors(_firstAuthors);
    }, [authors]);


    /**
     * Format the list of matched entities
     */
    useEffect(() => {
        let _entities = [];
        if (matchedEntities !== undefined) {
            matchedEntities.forEach((_e, _id) => {
                _entities.push(
                    <EntityMatched
                        key={_id}
                        id={_id}
                        label={_e.entityLabel}
                        link={_e.entityUri}
                        type={_e.entityType}
                    />)
            });
        }
        setMatchedEntitiesDisplay(_entities);
    }, [matchedEntities]);


    return (
        <div>
            <Row className="result align-items-center">
                <Col xs={11}>
                    <div className="">{matchedEntitiesDisplay}</div>
                    <span className="result-title">{title}.&nbsp;</span>
                    <span className="result-authors">{firstAuthors}.&nbsp;</span>
                    <span className="">{date}.&nbsp;</span>
                    <span className="fst-italic">{publisher !== undefined ? publisher + '.' : ''} </span>
                </Col>
                <Col xs={1} className="fs-5">
                    <Link className="a_icons" to={"/notice?uri=" + document}
                        target={title}><HiOutlineDocumentMagnifyingGlass /></Link>
                </Col>
            </Row>
            <div className="divider-light" />
        </div>
    );
};

SearchResult.propTypes = {
    document: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    authors: PropTypes.array,
    date: PropTypes.string,
    publisher: PropTypes.string,
    lang: PropTypes.string,
    matchedEntities: PropTypes.array
}

export default SearchResult;
