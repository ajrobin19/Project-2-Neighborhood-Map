import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends Component {

  render() {
    return (
      <Map google={this.props.google} initialCenter={this.props.initialCenter} zoom={14}>
        <Marker position={{lat: 39.2019, lng: -96.3050}} onClick={(e) => {window.alert('Click')}} />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyB9R7iubdV_Xn3N9A8m_90v-0SyYZ4DhUg'
})(MapContainer)