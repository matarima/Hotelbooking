import React, { useState, useContext, useRef, useEffect } from 'react';
import { SearchContext } from '../../SearchContext';
import axios from '../../utils/axiosConfig'; // Sử dụng axios instance
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Main style file
import 'react-date-range/dist/theme/default.css'; // Theme CSS file
import './SearchPopup.css';

const SearchPopup = () => {
  const [city, setCity] = useState('');
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const { setSearchResults } = useContext(SearchContext);

  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const dateRangePickerRef = useRef(null);

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get('/search', {
        params: {
          city,
          checkIn: dateRange[0].startDate.toISOString().split('T')[0],
          checkOut: dateRange[0].endDate.toISOString().split('T')[0],
          guests: adults + children,
          rooms,
        }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dateRangePickerRef.current && !dateRangePickerRef.current.contains(event.target)) {
        setShowDateRangePicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDateRangeChange = (item) => {
    setDateRange([item.selection]);
  };

  return (
    <div className="search-popup">
      <h2>Search</h2>
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <label>Destination</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div className="form-group" ref={dateRangePickerRef}>
          <label>Dates</label>
          <input
            type="text"
            onClick={() => setShowDateRangePicker(!showDateRangePicker)}
            readOnly
            value={`${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}`}
            required
          />
          {showDateRangePicker && (
            <DateRange
              editableDateInputs={true}
              onChange={handleDateRangeChange}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              className="date-range"
              minDate={new Date()}
            />
          )}
        </div>
        <div className="form-group">
          <label>Adults</label>
          <input
            type="number"
            min="1"
            value={adults}
            onChange={(e) => setAdults(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="form-group">
          <label>Children</label>
          <input
            type="number"
            min="0"
            value={children}
            onChange={(e) => setChildren(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="form-group">
          <label>Rooms</label>
          <input
            type="number"
            min="1"
            value={rooms}
            onChange={(e) => setRooms(parseInt(e.target.value))}
            required
          />
        </div>
        <button type="submit" className="search-button">Search</button>
      </form>
    </div>
  );
};

export default SearchPopup;