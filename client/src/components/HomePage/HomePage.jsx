import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axios from "../../utils/axiosConfig";
import "./HomePage.css";

const cityImages = {
  "Ha Noi": require("../../assets/Ha Noi.jpg"),
  "Ho Chi Minh": require("../../assets/Ho Chi Minh.jpg"),
  "Da Nang": require("../../assets/Da Nang.jpg"),
};

const typeImages = {
  "Hotel" : require("../../assets/hotel.jpg"),
  "Villas" : require("../../assets/villas.jpg"),
  "Resorts": require("../../assets/resorts.jpg"),
  "Apartments": require("../../assets/apartments.jpg"),
  "Cabins": require("../../assets/cabins.jpg")
}

const HomePage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("/homepage") // Đảm bảo đường dẫn chính xác đến API của bạn
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <div className="homepage">
      {data && (
        <>
          <div className="locations-container">
            {Object.entries(data.numOfHotelsByArea).map(([city, count]) => (
              <div key={city} className="location-card">
                <img src={cityImages[city]} alt={city} />
                <div className="location-info">
                  <h2>{city}</h2>
                  <p>{count} properties</p>
                </div>
              </div>
            ))}
          </div>

          <div className="property-container">
            <h2>Browse by property type</h2>
            <div className="property-types">
              {Object.entries(data.numOfHotelsByType).map(([type, count]) => (
                <div key={type} className="property-type">
                  <div className="property-image">
                    <img src={typeImages[type]} alt={type} />
                  </div>
                  <div className="property-info">
                    <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                    <p>{count} properties</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2>Homes guests love</h2>
          <div className="top-hotels">
            {data.topHotels.map((hotel) => (
              <div key={hotel.name} className="hotel">
                <img src={hotel.image} alt={hotel.name} />
                <Link to={`/hotel/${hotel.id}`}>
                  <h3>{hotel.name}</h3>
                </Link>
                <p>{hotel.city}</p>
                <p>Starting from ${hotel.cheapestPrice}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
