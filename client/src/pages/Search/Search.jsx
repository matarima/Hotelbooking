import React from "react";
import SearchPopup from "../../components/SearchPopup/SearchPopup";
import SearchList from "../../components/SearchList/SearchList";
import './Search.css';

const Search = () => {
  return (
    <div className="search-container">
      <div className="search-popups">
        <SearchPopup />
      </div>
      <div className="search-results">
        <SearchList />
      </div>
    </div>
  );
};

export default Search;