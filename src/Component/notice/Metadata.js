import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { isEmptyResponse } from "../../Utils";

import "./Metadata.css";

/**
 * Component to display article metadata: title, authors, date, license, etc.
 */
const Metadata = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [pub, setPub] = useState("");
  const [authors, setAuthors] = useState("");
  const [url, setUrl] = useState("");
  const [license, setLicense] = useState("");
  const [lang, setLang] = useState("");
  const articleUri = new URLSearchParams(useLocation().search).get("uri");

  /**
   * Get the article's metadata
   */
  useEffect(() => {
    let query =
      process.env.REACT_APP_BACKEND_URL +
      "/getArticleMetadata/?uri=" +
      articleUri;
    if (process.env.REACT_APP_LOG === "on") {
      console.log("articleUri: " + articleUri);
      console.log("Will submit backend query: " + query);
    }
    axios(query).then((response) => {
      if (!isEmptyResponse(query, response)) {
        setTitle(response.data.result[0].title);
        setDate(response.data.result[0].date?.substring(0, 4));
        setPub(response.data.result[0].pub);
        setUrl(response.data.result[0].url);
        setLicense(response.data.result[0].license);
        setLang(response.data.result[0].lang);
      }
    });
    //eslint-disable-next-line
  }, []);

  /**
   * Get the article's authors
   */
  useEffect(() => {
    let query =
      process.env.REACT_APP_BACKEND_URL +
      "/getArticleAuthors/?uri=" +
      articleUri;
    if (process.env.REACT_APP_LOG === "on") {
      console.log("Will submit backend query: " + query);
    }
    axios(query).then((response) => {
      if (!isEmptyResponse(query, response)) {
        let authorsST = "".substring(0);
        let listAuthors = response.data.result;
        listAuthors.forEach(
          (element) =>
            (authorsST = authorsST + element.authors.replace(",", "") + ", ")
        );
        // Remove the last ", "
        authorsST = authorsST.substring(0, authorsST.length - 2);
        setAuthors(authorsST);
      }
    });
  });

  let langTag =
    lang !== undefined ? (
      <span className="block">Language: {lang}</span>
    ) : (
      <span></span>
    );

  let licenseTag =
    license !== undefined ? (
      <span className="block">License: {license}</span>
    ) : (
      <span></span>
    );

  return (
    <div className="component">
      <h1 className="">{title} </h1>
      <p>
        <span className="metadata fw-bold"> {authors}. </span>
        <span className="metadata">{date}. </span>
        <span className="metadata">{title}. </span>
        <span className="metadata fst-italic">{pub}. </span>
        <span className="block">
          <a href={url} target="_article_page">
            {url}
          </a>
        </span>
      </p>

      <div className="divider" />

      <div className="">
        <table>
          <tbody>
            <tr>
              <td key="licence" valign="top" align="left">
                {langTag}
                {licenseTag}
                <span className="block">
                  <a href={articleUri}>Read the article</a>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Metadata;
