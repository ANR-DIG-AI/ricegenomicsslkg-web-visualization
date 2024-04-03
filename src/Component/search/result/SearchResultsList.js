import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SearchResult from "./SearchResult";
import ReactPaginate from "react-paginate";
import "./SearchResult.css";

/**
 *  This component implements the way search results are displayed: list of individual results
 *  shown by page, and buttons to navigate the pages.
 */
const SearchResultsList = (props) => {
  const { searchResults } = props;

  // Part of the results that is currently displayed (corresponding to the page number)
  let resultsSearch = [];

  const [resultsDisplayed, setResultsDisplayed] = useState([]);

  // Page of results that is currently displayed
  const [resultPage, setResultPage] = useState(1);

  // Number of pages of results
  const [resultPageCount, setResultPageCount] = useState(0);

  /**
   * Update the results currently displayed when a new search is performed
   */
  useEffect(() => {
    if (searchResults.length === 0) {
      setResultsDisplayed([]);
      setResultPageCount(0);
    } else {
      for (let i = 0; i < searchResults.length; i++) {
        if (
          searchResults[i].authors.length > 1 &&
          !searchResults[i].authors.includes("")
        ) {
          resultsSearch.push(searchResults[i]);
        }
      }
      // Update the count of pages
      let count = Math.ceil(
        resultsSearch.length / process.env.REACT_APP_RESULT_PAGE_SIZE
      );
      setResultPageCount(count);

      // Display the first page
      setResultPage(1);
    }
    //eslint-disable-next-line
  }, [resultsSearch]);

  /**
   * Update the results currently displayed when a page button is clicked
   */
  useEffect(() => {
    // Set the slice of results that are currently being shown
    const results = resultsSearch.slice(
      (resultPage - 1) * process.env.REACT_APP_RESULT_PAGE_SIZE,
      resultPage * process.env.REACT_APP_RESULT_PAGE_SIZE
    );
    setResultsDisplayed(results);
    //eslint-disable-next-line
  }, [resultPage, resultsSearch]);

  return (
    <div>
      {/* Buttons to navigate through the result pages */}
      <div className="navigation-section">
        <div className="">{resultsDisplayed.length} result(s).</div>
        <ReactPaginate
          pageCount={resultPageCount}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={(event) => setResultPage(event.selected + 1)}
          renderOnZeroPageCount={null}
          breakLabel="..."
          nextLabel=">"
          previousLabel="<"
          containerClassName={"navigation-buttons-group"}
          pageClassName={"navigation-button"}
          activeClassName={"navigation-button navigation-button-active"}
          nextClassName={"navigation-button"}
          previousClassName={"navigation-button"}
          breakClassName={"navigation-button"}
        />
      </div>

      {/* Show the current page of search results */}
      <div>
        <div className="divider-light" />

        {resultsDisplayed.map((_result, index) => (
          <SearchResult
            key={index}
            document={_result.document}
            title={_result.title}
            authors={_result.authors}
            date={_result.date}
            publisher={_result.publisher}
            lang={_result.lang}
            matchedEntities={
              _result.matchedEntities !== undefined
                ? _result.matchedEntities
                : []
            }
          />
        ))}
      </div>
    </div>
  );
};

SearchResultsList.propTypes = {
  searchResults: PropTypes.array.isRequired,
};

export default SearchResultsList;
