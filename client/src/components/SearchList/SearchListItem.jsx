import React from 'react';
import './SearchListItem.css';
import { Link } from 'react-router-dom';


const SearchListItem = ( { hotel: { hotel } } ) => {
  return (
    <div className="search-result-item">
      {hotel.photos && hotel.photos[0] && (
        <img src={hotel.photos[0]} alt={hotel.name} className="hotel-image" />
      )}
      <div className="hotel-info">
      <Link to={`/hotel/${hotel._id}`} className="hotel-name-link">
          <h3>{hotel.name}</h3> 
        </Link>
      <p>{hotel.distance} from center</p>
        {hotel.featured && <span className="hotel-featured">Featured</span>}
        <p>{hotel.desc}</p>
        <div className="availability-info">
          <p className="price">${hotel.cheapestPrice}</p>
          <button className="availability-button">See availability</button>
        </div>
        <div className="rating">
          {hotel.ratingText}
          <span className="rating-badge">{hotel.rating}</span>
        </div>
      </div>
    </div>
  );
};

export default SearchListItem;