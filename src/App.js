import React, { Component } from 'react';
import jsonData from '../src/data/restaurants.json';
import './App.css';

class App extends Component {
  	state = {
  		map: ""
  	}

  	constructor (props) {
		super(props)
		this.restaurants = []
		this.markers = []
	}
  componentWillMount() {
    this.renderMap()
    this.getRestaurants()
  }

  componentDidMount(){

  }

  renderMap = () => {
    //The following code was created with help from elharony at https://github.com/elharony/Udacity-P8-Neighborhood-Map-Project-Explained/blob/master/src/App.js
    loadScript("https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyB9R7iubdV_Xn3N9A8m_90v-0SyYZ4DhUg&v=3&callback=initMap")
    window.initMap = this.initMap
  }

  initMap = () => {
    this.setState(() => ({map : new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 39.1836, lng: -96.5717},
      zoom: 14
    })}))
  }

  getRestaurants = () => {
	  jsonData.results.map((restaurant) => {
	  	this.restaurants.push(restaurant)})
  }

  dropMarker = (restaurant) => {
  	var map = this.state.map

  	var marker = new window.google.maps.Marker({
	    map: map,
	    position: {lat: restaurant.geometry.location.lat, lng: restaurant.geometry.location.lat},
    	title: restaurant.name,
    	animation: window.google.maps.Animation.DROP,
    	id: restaurant.id
	});
  }

  render() {
    return (
      <main>
        <div id="menu">
	        	<div className='hamburgerButton'>
	        		<div className='hamburger'></div>
	        		<div className='hamburger'></div>
	        		<div className='hamburger'></div>
	    		</div>
        	<div id="menuContainter">
        		<h4>Filter Businesses</h4>
        		<select className='filter' value='filter'>
            		<option value="filter" disabled>Choose Filter...</option>
            		<option value="mexican">Mexican Cuisine</option>
            		<option value="chinese">Chinese Cuisine</option>
            		<option value="italian">Italian Cuisine</option>
            		<option value="steakhouse">Steakhouse</option>
            		<option value="pizza">Pizza</option>
          		</select>
        		<div id='menuList'>
        			{this.restaurants !== undefined && console.log(this.restaurants[0].name)}
        			{this.restaurants !== undefined && this.restaurants.map((restaurant) =>
        				<div key={restaurant.id}>
        					{window.google.maps !== undefined && this.dropMarker(restaurant)}
        					<hr />
        					<h5>{restaurant.name}</h5>
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