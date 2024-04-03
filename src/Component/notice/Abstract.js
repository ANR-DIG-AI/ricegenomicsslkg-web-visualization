import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { isEmptyResponse } from "../../Utils";

// Get the list of KBs that we consider in the named entities

/**
 * Formats the article abstract with annotated named entities
 */
const Abstract = () => {
  const [articleAbstract, setArticleAbstract] = useState("");
  const [namedEntities, setEntities] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const articleUri = new URLSearchParams(useLocation().search).get("uri");
  let result = [];

  /**
   * Retrieve the text of the article abstract from the backend
   */
  useEffect(() => {
    let query =
      process.env.REACT_APP_BACKEND_URL +
      "/getArticleMetadata/?uri=" +
      articleUri;
    if (process.env.REACT_APP_LOG === "on") {
      console.log("Will submit backend query: " + query);
    }
    axios(query).then((response) => {
      if (!isEmptyResponse(query, response)) {
        let abstract = response.data.result[0].abs;
        // alert(abstract);
        if (abstract === undefined) {
          abstract = "";
        } else {
          // Seems that some abstracts start with the term "Abstract" and that the named entities offset
          // does not take it into account. This is a nasty workaround.
          if (
            abstract !== undefined &&
            abstract.substring(0, 9).toLowerCase() === "abstract "
          ) {
            abstract = abstract.substr(9);
            alert(abstract);
          }
        }
        if (process.env.REACT_APP_LOG === "on") {
          console.log("Retrieved abstract: " + abstract);
        }
        setArticleAbstract(abstract);
      }
    });
    //eslint-disable-next-line
  }, []);

  /**
   * Retrieve the list of named entities from the backend
   */
  useEffect(() => {
    let query =
      process.env.REACT_APP_BACKEND_URL +
      "/getAbstractNamedEntities/?uri=" +
      articleUri;
    if (process.env.REACT_APP_LOG === "on") {
      console.log("Will submit backend query: " + query);
    }
    axios(query).then((response) => {
      if (!isEmptyResponse(query, response)) {
        let _entities = [];
        response.data.result.forEach((entity) => {
          _entities.push(entity);
        });

        let subTexts = [];

        if (process.env.REACT_APP_LOG === "on") {
          console.log(
            "------------------------- Retrieved " +
              _entities.length +
              " entities."
          );

          if (_entities.length > 0) {
            let abstract = _entities[0].abstract;
            if (abstract.trim().length > 0) {
              let subParts = abstract.split(".");
              for (let i = 0; i < subParts.length; i++) {
                let subText =
                  subParts[i] + (i === subParts.length - 1 ? "" : ".");
                let entities = [];
                _entities.forEach((e) => {
                  if (subText !== undefined) {
                    let subEntity = subText?.substring(e.startPos, e.endPos);
                    if (e.entityLabel === subEntity) {
                      // console.log(
                      //   "(" + e.startPos + "," + e.endPos + ")",
                      //   " >>> ",
                      //   e.entityLabel,
                      //   " #>> ",
                      //   e.abstract?.substring(e.startPos, e.endPos),
                      //   " -->> ",
                      //   subEntity
                      // );
                      entities.push(e);
                    }
                  }
                });
                // console.log([subText, entities.sort(sortByStartPos)]);
                subTexts.push([subText, entities.sort(sortByStartPos)]);
              }
            }
          }
        }
        setEntities(subTexts);
      }
    });
    //eslint-disable-next-line
  }, []);

  function sortByStartPos(a, b) {
    if (a.startPos < b.startPos) {
      return -1;
    }
    if (a.startPos > b.startPos) {
      return 1;
    }
    return 0;
  }

  /**
   * Turn the string "before word" into a string where "word" is an highlighted entity
   * @param id span identifier
   * @param text full abstract text
   * @param begin start position of the "before" text
   * @param e the data about the named entity (uri, label associated with the uri, start and end positions)
   * @param result
   */
  function wrap(id, partOfAbstract, result) {
    let subText = partOfAbstract[0]; //.trim();
    let entities = partOfAbstract[1];
    let pointer = 0;
    if (entities.length > 0) {
      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        let _startPos = pointer;
        let _endPos = entity.startPos;
        let before = subText?.substring(_startPos, _endPos);
        result.push(<span>{before}</span>);
        result.push(
          <span>
            <a
              href={entity.entityType}
              target="_external_entity"
              style={{ textDecoration: "none" }}
            >
              <span
                className="entity-label"
                style={{ color: "white" }}
                class=" parent-styled-badge"
              >
                <span
                  className="badge-kb"
                  style={{ color: "white" }}
                  class={entity.entityType.toLowerCase() + "  styled-badge"}
                >
                  {entity.entityType}
                </span>{" "}
                {entity.entityLabel}
              </span>
            </a>
          </span>
        );
        pointer = _endPos + entity.entityLabel.length;
        let after = "";
        if (entities.length - 1 - i >= 1) {
          after = subText?.substring(pointer, entities[i + 1].startPos);
        } else {
          after = subText?.substr(pointer);
        }
        result.push(<span>{after}</span>);
      }
    } else {
      result.push(<span>{subText}</span>);
    }
  }

  function LoadingButton() {
    const handleClick = () => setLoading(true);
    const clickAgain = () => setLoading(false);
    return (
      <Button
        className="annotate-button"
        variant="secondary"
        onClick={isLoading ? clickAgain : handleClick}
      >
        {isLoading ? "Hide named entities" : "Show named entities"}
      </Button>
    );
  }

  // ------------------------------------------------------------------------

  for (let i = 0; i < namedEntities.length; i++) {
    wrap("line-" + i, namedEntities[i], result);
  }

  return (
    <div className="component">
      <div className="content_header">Abstract</div>
      {isLoading ? result : articleAbstract}
      <LoadingButton />
    </div>
  );
};

export default Abstract;
