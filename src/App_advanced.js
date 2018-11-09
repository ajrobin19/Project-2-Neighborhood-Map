import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import {DebounceInput} from 'react-debounce-input'
import './App.css';

class App extends Component {
	state = {
  		map: "",
  		refresh: "yes"
  	}

  	constructor (props) {
		super(props)
		this.markers = []	
	}

  	componentDidMount() {
    	this.renderMap()
  	}


  	renderMap = () => {
	  	//The following code was created with help from elharony at https://github.com/elharony/Udacity-P8-Neighborhood-Map-Project-Explained/blob/master/src/App.js
	    loadScript("https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyB9R7iubdV_Xn3N9A8m_90v-0SyYZ4DhUg&v=3&callback=initMap")
	    window.initMap = this.initMap
  	}


  	getPlaces = () => {
	    const input = document.getElementById('placesSearch').value;
	    const proxyurl = "https://cors-anywhere.herokuapp.com/";
	    const url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+input +"&location=39.1836,-96.5717&radius=100&key=AIzaSyB9R7iubdV_Xn3N9A8m_90v-0SyYZ4DhUg"; // site that doesn’t send Access-Control-*
	    fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
	    .then(response => response.json())
	    .then(contents => this.placeMarkers(contents))
	    .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
  	}

  	clearMarkers = () => {
        for (var i = 0; i < this.markers.length; i++) {
        	this.markers[i].setMap(null);
        }
    }

  	placeMarkers = (places) => {
  		this.clearMarkers()

  		var map = this.state.map

  		places.results.forEach(place => {
		  	var marker = new window.google.maps.Marker({
			    map: map,
			    position: {lat: place.geometry.location.lat, lng: place.geometry.location.lng},
            	title: place.name,
            	animation: window.google.maps.Animation.DROP,
            	id: place.id
			});
			var largeInfoWindow = new window.google.maps.InfoWindow({
		        content: '<div>' +place.name +'</div>'
		    });

			this.markers.push(marker)

		    marker.addListener('click', function() {
		        largeInfoWindow.open(map, marker)
		    })
  		})

  		this.updateList()
  	}

  	updateList = () => {
  		this.setState(() => ({refresh : "yes"}))
  	}

	initMap = () => {
	    
	    this.setState(() => ({map : new window.google.maps.Map(document.getElementById('map'), {
	      center: {lat: 39.1836, lng: -96.5717},
	      zoom: 14
	    })}))
	}

  render() {
    return (
      <main>
        <div id="menu">
        	<div className='hamburger'></div>
        	<div className='hamburger'></div>
        	<div className='hamburger'></div>
        	<div id="menuContainter">
        		<h4>Search for Businesses</h4>
        		<DebounceInput type="text" id="placesSearch" minLength={1} debounceTimeout={500} placeholder="Search" onChange={this.getPlaces}/>
        		<hr />
        		<div id='menuList'>
        			{this.markers !== undefined && this.markers.map((marker) =>
        				<div key={marker.id}>
        					<h5>{marker.title}</h5>
        					<hr />
        				</div>
        			)}
        		</div>
          	</div>
        </div>
        <div id="map"></div>
      </main>
    )
  }
}

function loadScript(url) {
  var index  = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

export default App;