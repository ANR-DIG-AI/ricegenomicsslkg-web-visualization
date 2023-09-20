import React, {useState, useEffect} from 'react';
import {ButtonGroup, Button, Form, Row, Col, ToggleButton} from "react-bootstrap";
import ListGroup from 'react-bootstrap/ListGroup';
import axios from "axios";
import './SearchForm.css';
import SuggestionEntity from "./SuggestionEntity";

import {suggestionsMock} from './suggestions.mock';
import SearchEntity from "./SearchEntity";
import {isEmptyResponse} from "../../Utils";
import SearchResult from "./SearchResult";

/**
 * The search form is meant to help a user select entities from a vocabulary (e.g. Agrovoc)
 * by entering the first letters of entity labels and obtaining a list of suggestions (auto-completion).
 *
 * The whole component consists of 3 elements:
 * - a simple form with an input field and a search button
 * - a list of suggested entities to perform auto-completion based on the input field
 * - a list of entities already selected by the user, those can be removed.
 *
 * When clicking the search button, the selected entities are used to perform different semantic searches.
 *
 * @returns {JSX.Element}
 * @constructor
 */
function SearchForm() {
    // Term typed in the input field
    const [input, setInput] = useState('');

    // Suggestions for autocompletion.
    // Each suggestion should be an object like {entityLabel: "...", entityUri: "...", entityPrefLabel: "..."}
    const [suggestions, setSuggestions] = useState([]);

    // Search entities already selected
    const [searchEntities, setSearchEntities] = useState([]);

    // Status of the search button
    const [isLoading, setLoading] = useState(false);

    // Results returned by the last search
    const [searchResults, setSearchResults] = useState([]);

    // Part of the results that is currently displayed (corresponding to the page number)
    const [searchResultsDisplayed, setSearchResultsDisplayed] = useState([]);

    // Page of results that is currently displayed
    const [searchResultsPage, setSearchResultsPage] = useState(1);

    // Number of pages of results
    const [searchResultPageCount, setSearchResultPageCount] = useState(0);


    /**
     * Use the autocomplete service to propose suggestions based on the current input value.
     */
    useEffect(() => {
        if (input.length < process.env.REACT_APP_MIN_SIZE_FOR_AUTOCOMPLETE) {
            setSuggestions([]);
        } else {
            if (process.env.REACT_APP_USE_MOCK_SEARCH_SERVICE === "true") {

                // -----------------------------------------------
                // Use a mock suggestion service for tests
                // -----------------------------------------------
                const filteredSuggestions = suggestionsMock.filter(
                    (_s) => _s.entityLabel.toLowerCase().includes(input)
                );
                setSuggestions(filteredSuggestions);
            } else {

                // -----------------------------------------------
                // Invoke the auto-completion service
                // -----------------------------------------------

                let query = process.env.REACT_APP_BACKEND_URL + "/autoCompleteAgrovoc/?input=" + input;
                if (process.env.REACT_APP_LOG === "on") {
                    console.log("Will submit backend query: " + query);
                }
                axios(query).then(response => {
                    if (response.data === undefined) {
                        // If there is no suggestion, empty the previous list of suggestions
                        setSuggestions([]);
                    } else {
                        let newSuggestions = response.data.filter(
                            // Do not suggest an entity that is already in the list of selected entities
                            _s => !searchEntities.some(_e => _e.entityLabel.toLowerCase() === _s.entityLabel.toLowerCase()
                                && _s.entityUri === _e.entityUri)
                        );
                        setSuggestions(newSuggestions);
                        if (process.env.REACT_APP_LOG === "on") {
                            console.log("------------------------- Retrieved " + newSuggestions.length + " suggestions.");
                            newSuggestions.forEach(e => console.log(e));
                        }
                    }
                })
            }
        }
        //eslint-disable-next-line
    }, [input]);


    /**
     * Enter is like clicking on the search button
     * @param {Object} e - event
     */
    const handleInputKeyUp = (e) => {
        if (e.key === 'Escape') {
            setSuggestions([]); // Clear suggestions on Escape
        }

        // if (e.key === 'Enter' && input.trim() !== '') {
        //     // @TODO - possible to use the arrows to navigate the suggestions and enter to select one?
        //     setInput('');
        //     setSuggestions([]); // Clear suggestions when an item is added
        // }
    };

    /**
     * When a suggestion is selected, it is added to the selected entities and
     * the input field and suggestions list are cleared.
     * @param {number} index - index of the selected suggestion
     */
    const handleSelectSuggestion = (index) => {
        let newEntity = {
            entityLabel: suggestions[index].entityLabel,
            entityUri: suggestions[index].entityUri,
            entityPrefLabel: '(' + suggestions[index].entityPrefLabel + ')'
        };
        setSearchEntities([...searchEntities, newEntity]);
        setInput('');
        setSuggestions([]);
    };

    /**
     * Remove one entity from the selected entities
     * @param {number} index
     */
    const handleRemoveEntity = (index) => {
        if (process.env.REACT_APP_LOG === "on") {
            console.log("Removing entity: " + searchEntities[index].entityLabel);
        }
        const newEntities = [...searchEntities];
        newEntities.splice(index, 1);
        setSearchEntities(newEntities);
        if (process.env.REACT_APP_LOG === "on") {
            if (newEntities.length === 0)
                console.log("Removed all entities.");
        }
    };


    /**
     * Search action triggered by the search button
     */
    useEffect(() => {
        if (isLoading) {
            if (searchEntities.length === 0) {
                if (process.env.REACT_APP_LOG === "on") {
                    console.log("------------------------- No search entity was selected, not invoking search service.");
                }
                setLoading(false);
                setSearchResults([]);
            } else {
                let query = process.env.REACT_APP_BACKEND_URL + "/searchDocumentsByDescriptor/?uri=" + searchEntities.map(_s => _s.entityUri).join(',');
                if (process.env.REACT_APP_LOG === "on") {
                    console.log("Will submit backend query: " + query);
                }
                axios(query).then(response => {
                    setLoading(false);
                    if (isEmptyResponse(query, response)) {
                        setSearchResults([]);
                    } else {
                        let results = response.data.result;
                        if (process.env.REACT_APP_LOG === "on") {
                            console.log("------------------------- Retrieved " + results.length + " search results.");
                            results.forEach(e => console.log(e));
                        }
                        setSearchResults(results);

                        // Update the count of pages and display the first page
                        let count = Math.ceil(results.length / process.env.REACT_APP_RESULT_PAGE_SIZE);
                        setSearchResultPageCount(count);
                        setSearchResultsPage(1);
                    }
                })
            }
        }
        //eslint-disable-next-line
    }, [isLoading]);


    /**
     * Update the results currently displayed.
     * Invoked whenever a new search is performed, or when a page button is clicked
     */
    useEffect(() => {
        if (searchResults.length === 0) {
            setSearchResultsDisplayed([]);
            setSearchResultPageCount(0);
        } else {
            const results = searchResults.slice(
                (searchResultsPage - 1) * process.env.REACT_APP_RESULT_PAGE_SIZE,
                searchResultsPage * process.env.REACT_APP_RESULT_PAGE_SIZE
            );
            setSearchResultsDisplayed(results);
        }
        //eslint-disable-next-line
    }, [searchResults, searchResultsPage]);


    return (
        <div className="component">
            <div className="multiple-inputs-container">

                { /* List of the search entities that have already been selected */}
                <div className="entity-list">
                    {searchEntities.map((entity, index) => (
                        <SearchEntity key={index} id={index}
                                      entityLabel={entity.entityLabel}
                                      entityUri={entity.entityUri}
                                      entityPrefLabel={entity.entityPrefLabel}
                                      handleRemove={handleRemoveEntity}
                        />
                    ))}
                </div>

                <Form>
                    { /* Input field and search button */}
                    <Row className="mb-1">
                        <Col xs={10}>
                            <Form.Control type="text" className="input-field"
                                          placeholder="Enter text and select among the suggestions"
                                          value={input}
                                          onChange={(e) => setInput(e.target.value)}
                                          onKeyUp={handleInputKeyUp}
                            />
                        </Col>
                        <Col xs={2}>
                            <Button id="search-button" className="search-button" variant="secondary"
                                    disabled={isLoading}
                                    onClick={!isLoading ? () => setLoading(true) : null}>
                                {isLoading ? 'Searching...' : 'Search'}
                            </Button>
                        </Col>
                    </Row>
                    { /* <Row className="mx-3">
                        <Col>
                            <Form.Switch
                                id="search-switch"
                                label="Also search full-text"
                                className="search-switch"
                            />
                        </Col>
                    </Row> */}

                    { /* Auto-complete: list of suggestions of entities base on the input */}
                    <ListGroup className="suggestion-list overflow-auto">
                        {suggestions.map((suggestion, index) => (
                            <SuggestionEntity key={index} id={index}
                                              input={input}
                                              entityLabel={suggestion.entityLabel}
                                              entityUri={suggestion.entityUri}
                                              entityPrefLabel={suggestion.entityPrefLabel}
                                              handleSelect={handleSelectSuggestion}
                            />
                        ))}
                    </ListGroup>

                </Form>
            </div>

            <div className="divider"/>

            { /* ========================================================================================== */}

            { /* Navigation through the result pages */}
            <div className="navigation-buttons">
                <span className="">{searchResults.length} result(s).</span>
                &nbsp;

                <ButtonGroup>
                    {Array.from({length: searchResultPageCount}, (_, index) => index + 1).map(
                        (page, index) => (
                            <ToggleButton key={index} className="navigation-button" variant="outline-secondary"
                                            type="radio"
                                            onClick={() => setSearchResultsPage(page)}
                                            value={page}
                                            checked={page === searchResultsPage}>
                                {page}
                            </ToggleButton>
                        ))}
                </ButtonGroup>
            </div>

            { /* Search results */}
            <div>
                <div className="divider-light"/>

                {searchResultsDisplayed.map((_result, index) => (
                    <SearchResult key={index}
                                  uri={_result.uri}
                                  title={_result.title}
                                  authors={_result.authors}
                                  date={_result.date}
                                  publisher={_result.publisher}
                                  linkPDF={_result.linkPDF}
                    />
                ))}
            </div>

        </div>
    );
}

export default SearchForm;