import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateRange } from 'react-date-range';
import { SearchContext } from '../../SearchContext';
import axios from '../../utils/axiosConfig';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { setSearchResults } = useContext(SearchContext);

  const [destination, setDestination] = useState('');
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [options, setOptions] = useState({
    adults: 1,
    children: 0,
    rooms: 1
  });
  const [showDateModal, setShowDateModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const dateModalRef = useRef(null);
  const optionsModalRef = useRef(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get('/search', {
        params: {
          city: destination,
          checkIn: dateRange[0].startDate.toISOString().split('T')[0],
          checkOut: dateRange[0].endDate.toISOString().split('T')[0],
          guests: options.adults + options.children,
          rooms: options.rooms,
        },
      });
      
      setSearchResults(response.data);
      navigate('/search');
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dateModalRef.current && !dateModalRef.current.contains(event.target) &&
        optionsModalRef.current && !optionsModalRef.current.contains(event.target)
      ) {
        setShowDateModal(false);
        setShowOptionsModal(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDateChange = (item) => {
    setDateRange([item.selection]);
  };

  return (
    <div className="header">
      <div className="header-content">
        <h1>A lifetime of discounts? It's Genius.</h1>
        <p>Get rewarded for your travels – unlock instant savings of 10% or more with a free account</p>
        <button className="header-button">Sign in / Register</button>
      </div>
      <div className="header-search">
        <div className="header-search-item">
          <i className="fas fa-bed"></i>
          <input
            type="text"
            placeholder="Where are you going?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <div className="header-search-item" ref={dateModalRef}>
          <i className="fas fa-calendar-alt"></i>
          <input
            type="text"
            value={`${dateRange[0].startDate.toLocaleDateString()} to ${dateRange[0].endDate.toLocaleDateString()}`}
            readOnly
            onClick={() => { setShowDateModal(true); setShowOptionsModal(false); }}
          />
          {showDateModal && (
            <div className="date-modal">
              <DateRange
                editableDateInputs={true}
                moveRangeOnFirstSelection={false}
                minDate={new Date()}
                ranges={dateRange}
                onChange={handleDateChange}
                className="date-range"
              />
            </div>
          )}
        </div>
        <div className="header-search-item" ref={optionsModalRef}>
          <i className="fas fa-user"></i>
          <input
            type="text"
            placeholder={`${options.adults} adult · ${options.children} children · ${options.rooms} room`}
            readOnly
            onClick={() => { setShowOptionsModal(true); setShowDateModal(false); }}
          />
          {showOptionsModal && (
            <div className="options-modal">
              <div className="option-item">
                <span>Adults</span>
                <input
                  type="number"
                  min="1"
                  value={options.adults}
                  onChange={(e) => setOptions({ ...options, adults: parseInt(e.target.value) })}
                />
              </div>
              <div className="option-item">
                <span>Children</span>
                <input
                  type="number"
                  min="0"
                  value={options.children}
                  onChange={(e) => setOptions({ ...options, children: parseInt(e.target.value) })}
                />
              </div>
              <div className="option-item">
                <span>Rooms</span>
                <input
                  type="number"
                  min="1"
                  value={options.rooms}
                  onChange={(e) => setOptions({ ...options, rooms: parseInt(e.target.value) })}
                />
              </div>
            </div>
          )}
        </div>
        <button onClick={handleSearch} className="header-search-button">Search</button>
      </div>
    </div>
  );
};

export default Header;
