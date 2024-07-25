import React, { useContext } from 'react';
import { SearchContext } from '../../SearchContext'; // Đảm bảo đúng đường dẫn
import SearchListItem from './SearchListItem'; // Đảm bảo đúng đường dẫn
import './SearchList.css';

const SearchList = () => {
  const { searchResults } = useContext(SearchContext);

  return (
    <div className="search-results">
      {searchResults.length > 0 ? (
        searchResults.map((result, index) => (
          <SearchListItem key={result._id || index} hotel={result} />
        ))
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchList;