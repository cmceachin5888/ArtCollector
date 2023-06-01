import React from 'react';
import { fetchQueryResultsFromURL } from '../api';

  /**
   * Destructure setSearchResults, setFeaturedResult, and setIsLoading from props
   * and also destructure info and records from props.searchResults
   * 
   * You need info, records, setSearchResults, setFeaturedResult, and setIsLoading as available constants
   */

const Preview = ({ searchResults, setSearchResults, setFeaturedResult, setIsLoading }) => {
  const { info, records } = searchResults;
  
  /**
   * Don't touch this function, it's good to go.
   * 
   * It has to be defined inside the Preview component to have access to setIsLoading, setSearchResults, etc...
   */
  async function fetchPage(pageUrl) {
    setIsLoading(true);

    try {
      const results = await fetchQueryResultsFromURL(pageUrl);
      setSearchResults(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <aside id="preview">
      <header className="pagination">
        {/* This button should be disabled if nothing is set in info.prev, and should call fetchPage with info.prev when clicked */}
        <button 
          disabled={!info.prev} 
          className="previous"
          onClick={() =>fetchPage(info.prev)}>Previous</button>
        {/* This button should be disabled if nothing is set in info.next, and should call fetchPage with info.next when clicked */}
        <button
          disabled={!info.next}
          className="next"
          onClick={() => fetchPage(info.next)}>Next</button>
      </header>
      <section className="results">
        {
          /* Here we should map over the records, and render something like this for each one:
            <div  
              key={ index }
              className="object-preview"
              onClick={(event) => {
                // prevent the default
                // set the featured result to be this record, using setFeaturedResult
              }}>
              { 
                // if the record.primaryimageurl exists, show this: <img src={ record.primaryimageurl } alt={ record.description } />, otherwise show nothing 
              }
              {
                // if the record.title exists, add this: <h3>{ record.title }</h3>, otherwise show this: <h3>MISSING INFO</h3>
              }
            </div>
          */
        records.map((record, index) => (
          <div  
              key={ index }
              className="object-preview"
              onClick={(event) => {
                // prevent the default
                event.preventDefault();
                // set the featured result to be this record, using setFeaturedResult
                setFeaturedResult(record);
              }}>
              { 
                // if the record.primaryimageurl exists, show this: <img src={ record.primaryimageurl } alt={ record.description } />, otherwise show nothing
                record.primaryimageurl && (
                  <img src={ record.primaryimageurl } alt={ record.description } />
                )
              }
              {
                // if the record.title exists, add this: <h3>{ record.title }</h3>, otherwise show this: <h3>MISSING INFO</h3>
                record.title ? (
                  <h3>{ record.title }</h3>
                ) : (
                  <h3>MISSING INFO</h3>
                )
              }
            </div>
        ))}
      </section>
    </aside>
  );
};

export default Preview;