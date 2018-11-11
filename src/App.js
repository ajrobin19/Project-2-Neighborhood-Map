import React, { Component } from 'react';
import jsonData from '../src/data/restaurants.json';
import './App.css';

class App extends Component {
  	//Items that need to be globablly available. Used the state for the following items so that the app would re-render.
  	state = {
  		map: "",
  		initialized: false,
  		refresh: 'no'
  	}

  	//Items that need to be globally available.
  	constructor (props) {
		super(props)
		this.restaurants = []
		this.completeRestaurantsList = []
		this.markers = []

	}

	//This calls for the map to be rendered and grabs the list of restaurants.
  	componentWillMount() {
	    this.renderMap()
	    this.getRestaurants()
  	}

  	//Gets the map and calls the function to initialize it.
	renderMap = () => {
	    //The following code was created with help from elharony at https://github.com/elharony/Udacity-P8-Neighborhood-Map-Project-Explained/blob/master/src/App.js
	    loadScript("https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyB9R7iubdV_Xn3N9A8m_90v-0SyYZ4DhUg&v=3&callback=initMap")
	    window.initMap = this.initMap
	}

	//Initializes the map and saves it to the state.
  	initMap = () => {
    	this.setState(() => ({map : new window.google.maps.Map(document.getElementById('map'), {
     		center: {lat: 39.1836, lng: -96.5717},
      		zoom: 15
    	}),
			initialized: true
		}))
		
  	}

  	//Gets the list of restaurants from JSON file and saves it to the constructor props.
  	getRestaurants = () => {
		jsonData.results.map((restaurant) => {
			this.restaurants.push(restaurant)
			this.completeRestaurantsList.push(restaurant)
		})
  	}

  	//Removes the markers from the map and erases the array.
  	removeMarkers = () => {
  		for (var i = 0; i < this.markers.length; i++) {
        	this.markers[i].setMap(null);
        }

        this.markers = []
  	}

  	//Filters the list of restaurants and the markers according to the filter value.
  	filterRestaurants = () => {
  		this.removeMarkers()

  		this.restaurants = this.completeRestaurantsList

  		var filterCategory = document.getElementById('filter').value

  		if(filterCategory !== 'none'){
  			this.restaurants = this.restaurants.filter(restaurant => restaurant.types === filterCategory)
  		}

  		this.setState(() => ({refresh:'yes'}))
  	}

  	//Places the markers on the map
  	dropMarker = (restaurant) => {
  		var map = this.state.map

  		var marker = new window.google.maps.Marker({
	    	map: map,
	   		position: {lat: restaurant.geometry.location.lat, lng: restaurant.geometry.location.lng},
    		title: restaurant.name,
    		animation: window.google.maps.Animation.DROP,
    		id: restaurant.id
		});

  		this.markers.push(marker)

		var self = this
		marker.addListener('click', function(){
			self.createAndOpenInfoWindow(restaurant)
		})
  	}

  	//Retrieves and returns the marker in need
  	getMarker = (restaurant) => {
  		var marker = this.markers.filter(marker => restaurant.id === marker.id)

  		return marker[0]
  	}

  	//Sets and opens the info window for the restaurant that has been chosen.
  	openInfoWindow = (marker, businessInfo) => {
  		var infoWindow = new window.google.maps.InfoWindow({
				content: `<div className='infoWindow'>
				<h2 class='centerText'>${businessInfo.name}</h2>
				<p><b>Address: </b>${businessInfo.location.display_address[0]}, ${businessInfo.location.display_address[1]}</p>
				<p><b>Phone: </b>${businessInfo.display_phone}</p>
				<p><b>Yelp Rating: </b>${businessInfo.rating} stars from ${businessInfo.review_count} reviews</p>
				<p><b>Yelp Website: </b><a href='${businessInfo.url}' target='_blank'>${businessInfo.name}</a></p>
				</div>`
			})

  		infoWindow.open(this.state.map, marker)
  	}

  	//Gathers all of the information for the info window. Fetches the restraunt information through the Yelp API. Sends it all to the openInfoWindow function to complete the process.
  	createAndOpenInfoWindow = (restaurant) => {
  		var marker = this.getMarker(restaurant)
  		var app = this

  		 // function toggleBounce() {
     //    if (marker.getAnimation() !== null) {
     //      marker.setAnimation(null);
     //    } else {
     //      marker.setAnimation(google.maps.Animation.BOUNCE);
     //    }
     //  }
      	marker.setAnimation(window.google.maps.Animation.BOUNCE)
      	setTimeout(function(){marker.setAnimation(null)}, 1000)

		const apiKey = "qRuURpX1yy2KItA1p3K4daciEhOhqRNKKqxCR72jVjGvDZkJGoUls2-sjLfS8JXzPRIlKqIATD2nNqZDg3Jl-fZGhQNcOTlyP6LI28T8-MTAxJb2wuTYixTd6HHmW3Yx";
		let myHeaders = new Headers();
		myHeaders.append("Authorization", "Bearer " + apiKey);
		const proxyUrl = "https://cors-anywhere.herokuapp.com/"

		fetch(proxyUrl +"https://api.yelp.com/v3/businesses/search?location=66502&term=" +restaurant.name, {headers: myHeaders})
		.then(response => response.json())
		.then(businessIdArray => businessIdArray.businesses[0])
		.then(function(businessInfo){
			app.openInfoWindow(marker, businessInfo)
		})
		.catch(e => window.alert('There has been a problem loading the Yelp API'))
  	}

  	//Function to handle what happens when the hamburger menu is clicked.
  	hamburgerClick = () => {
  		var menuContainter = document.getElementById('menuContainter')

  		if(menuContainter.style.display === 'none'){
  			menuContainter.style.display = 'block'
  			document.getElementById('menu').style.width = "20vw";
  		}
  		else{
  			menuContainter.style.display = 'none'
  			document.getElementById('menu').style.width = "50px";
  		}
	}

  	render() {
    	return (
     		<main>
        		<div id="menu">
	        		<div id='hamburgerButton' onClick={this.hamburgerClick}>
	        			<div className='hamburger'></div>
	        			<div className='hamburger'></div>
	        			<div className='hamburger'></div>
	    			</div>
        		<div id="menuContainter">
        			<h4 className='filterBusinesses'>Filter Businesses</h4>
        			<select id='filter' value='filter' onChange={this.filterRestaurants}>
            			<option value="filter" disabled>Choose Filter...</option>
            			<option value="mexican">Mexican Cuisine</option>
            			<option value="chinese">Chinese Cuisine</option>
            			<option value="italian">Italian Cuisine</option>
            			<option value="steakhouse">Steakhouse</option>
            			<option value="pizza">Pizza</option>
            			<option value="none">None</option>
          			</select>
        			<div id='menuList'>
        				{this.restaurants !== undefined && this.restaurants.map((restaurant) =>
        					<div key={restaurant.id} tabIndex={restaurant.tab} aria-label={restaurant.name} onKeyPress={(e) => (e.keyCode === 0) && (this.createAndOpenInfoWindow(restaurant))} onClick={() => (this.createAndOpenInfoWindow(restaurant))}>
        						{this.state.initialized && this.dropMarker(restaurant)}
        						<hr />
        						<h5 id={restaurant.id} >{restaurant.name}</h5>
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
  script.onerror = function(){window.alert('There has been a problem loading Google Maps')}
  index.parentNode.insertBefore(script, index)
}

export default App;