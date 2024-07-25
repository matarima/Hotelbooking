import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useState({
    destination: '',
    dates: {
      startDate: new Date(),
      endDate: new Date()
    },
    options: {
      adults: 1,
      children: 0,
      rooms: 1
    }
  });
  
  const [searchResults, setSearchResults] = useState([]);

  return (
    <SearchContext.Provider value={{ searchParams, setSearchParams, searchResults, setSearchResults }}>
      {children}
    </SearchContext.Provider>
  );
};