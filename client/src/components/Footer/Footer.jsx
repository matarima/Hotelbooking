import React from "react";
import FooterData from "../../data/footer.json";
import "./Footer.css";

const Footer = () => {
    return (
        <div className='footer'>
        {FooterData.map((column, index) => {
          const { col_number, col_values } = column;
          return (
            <div key={`col-${col_number}`} className='footer-col'>
              {col_values.map((value, i) => <p key={`col-value-${i}`}>{value}</p>)}
            </div>
          );
        })}
      </div>
    );
};

export default Footer;