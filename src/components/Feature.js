import React, { Fragment } from 'react';

// Don't touch this import
import { fetchQueryResultsFromTermAndValue } from '../api';

/**
 * We need a new component called Searchable which:
 * 
 * Has a template like this:
 * 
    <span className="content">
        <a href="#" onClick={async (event) => {}}>SOME SEARCH TERM</a>
    </span>
 *
 * You'll need to read searchTerm, searchValue, setIsLoading, and setSearchResults off of the props.
 * 
 * When someone clicks the anchor tag, you should:
 * 
 * - preventDefault on the event
 * - call setIsLoading, set it to true
 * 
 * Then start a try/catch/finally block:
 * 
 * try:
 *  - await the result of fetchQueryResultsFromTermAndValue, passing in searchTerm and searchValue
 *  - send the result to setSearchResults (which will update the Preview component)
 * catch: 
 *  - console.error the error
 * finally:
 *  - call setIsLoading, set it to false
 */
const Searchable = ({ searchTerm, searchValue, setIsLoading, setSearchResults }) => {

    const handleClick = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
          const result = await fetchQueryResultsFromTermAndValue(searchTerm, searchValue);
          setSearchResults(result);

        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <span className="content">
            <a href="#" onClick={handleClick}>{searchValue}</a>
        </span>
    )
}

/**
 * We need a new component called Feature which looks like this when no featuredResult is passed in as a prop:
 * 
 * <main id="feature"></main>
 * 
 * And like this when one is:
 * 
 * <main id="feature">
 *   <div className="object-feature">
 *     <header>
 *       <h3>OBJECT TITLE</h3>
 *       <h4>WHEN IT IS DATED</h4>
 *     </header>
 *     <section className="facts">
 *       <span className="title">FACT NAME</span>
 *       <span className="content">FACT VALUE</span>
 *       <span className="title">NEXT FACT NAME</span>
 *       <span className="content">NEXT FACT VALUE</span>
 *     </section>
 *     <section className="photos">
 *       <img src=IMAGE_URL alt=SOMETHING_WORTHWHILE />
 *     </section>
 *   </div>
 * </main>
 * 
 * The different facts look like this: title, dated, images, primaryimageurl, description, culture, style, 
 * technique, medium, dimensions, people, department, division, contact, creditline
 * 
 * The <Searchable /> ones are: culture, technique, medium (first toLowerCase it), and person.displayname (one for each PEOPLE)
 * 
 * NOTE: people and images are likely to be arrays, and will need to be mapped over if they exist
 * 
 * This component should be exported as default.
 */
const Feature = ({ featuredResult, setIsLoading, setSearchResults }) => {

    if (!featuredResult) {
        return(
            <main id="feature"></main>
        );
    }

  const {
      title, 
      dated, 
      images, 
      primaryimageurl, 
      description, 
      culture, 
      style, 
      technique, 
      medium, 
      dimensions, 
      people, 
      department, 
      division, 
      contact, 
      creditline
  } = featuredResult;

  const renderFacts = () => {
      const facts = [
          { name: 'Description', value: description },        
          { name: 'Culture', value: culture, searchable: true },
          { name: 'Style', value: style},
          { name: 'Technique', value: technique, searchable: true },
          { name: 'Medium', value: medium, searchable: true },
          { name: 'Dimensions', value: dimensions},
          { name: 'Person', value: people?.map((person) => person.displayname).join(', '), searchable: true },
          { name: 'Department', value: department},
          { name: 'Division', value: division},
          { name: 'Contact', value: contact},
          { name: 'Creditline', value: creditline}
      ];

      return facts.map((fact, index) => {
        if (fact.value) {
          if (fact.searchable) {
            return (
              <React.Fragment key={index}>
                <span className="title">{fact.name}</span>
                <span className="content">
                  <Searchable searchTerm={fact.name.toLowerCase()} searchValue={fact.value} setIsLoading={setIsLoading} setSearchResults={setSearchResults} />
                </span>
              </React.Fragment>
            );
          } else {
            return (
              <React.Fragment key={index}>
                <span className="title">{fact.name}</span>
                <span className="content">{fact.value}</span>
              </React.Fragment>
            );
          }
        } else {
          return null;
        }
      });
  };

  const renderPhotos = () => {
    if (images && images.length > 0) {
      return (
        <section className="photos">
          {images.map((image) => (
            <img key={image.imageid} src={image.baseimageurl} alt={image.alttext} />
          ))}
        </section>
      );
    }
  
    if (primaryimageurl) {
      return (
        <section className="photos">
          <img src={primaryimageurl} alt={featuredResult.alttext} />
        </section>
      );
    }
  
    return null;
  };


  return (
    <main id="feature">
      <div className="object-feature">
        <header>
          <h3>{title}</h3>
          <h4>{dated}</h4>
        </header>
        <section className="facts">{renderFacts()}</section>
        {renderPhotos()}
      </div>
    </main>
  );
};

export default Feature;