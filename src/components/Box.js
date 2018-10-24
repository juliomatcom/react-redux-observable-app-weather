import React from 'react';
import './Box.css';

export default function (props) {
  const iconUrl = `http://openweathermap.org/img/w/${props.data.icon}.png`;
  const imgTag = props.data.icon ? <img className="icon" src={iconUrl} alt="Weather icon"/> : undefined;
  const tempColor = props.data.temp <= 20 ? '#80acf2' : '#d87272';
  const tempStyle = {
    color: tempColor
  };
  const backgroundStyle = {
    backgroundColor: tempColor
  };
  const panel = (
    <div className="box">
      <div className="city-container" style={backgroundStyle}>
        <p className="city">{props.city}</p>
      </div>
      <div className="info">
        <span className="temp" style={tempStyle}>
          {props.data.temp ? `${props.data.temp}º` : '-'}
        </span>
        {imgTag}
        <span className="description"> {props.data.description} </span>
      </div>
    </div>
  );

  const emptyPanel = (
    <div className="box box-empty">
      <p>Pick a city</p>
      {props.loading}
    </div>
  );
  return props.city ? panel : emptyPanel;
};
