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
		this.infoWindow = ''
		this.bounds = ''
		this.autocomplete = ''
	}

	//This calls for the map to be rendered and grabs the list of restaurants.
  	componentWillMount() {
	    this.renderMap()
	    // this.getRestaurants()
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
      		zoom: 15,
      		mapTypeControlOptions: {
              style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: window.google.maps.ControlPosition.TOP_CENTER
          	}
    	}),
			initialized: true
		}))
		this.infoWindow = new window.google.maps.InfoWindow()
		this.bounds = new window.google.maps.LatLngBounds()
		
		var self = this
		this.autocomplete = new window.google.maps.places.Autocomplete(document.getElementById('placesSearch'))
		this.autocomplete.bindTo('bounds', this.state.map)
        this.autocomplete.setFields(['address_components', 'geometry', 'icon', 'name'])
        this.autocomplete.addListener('place_changed', function() {
        	self.getPlaces()
		})
  	}

  	//Gets the list of restaurants from JSON file and saves it to the constructor props.
  	getRestaurants = () => {
		jsonData.results.forEach((restaurant) => {
			this.restaurants.push(restaurant)
			this.completeRestaurantsList.push(restaurant)
		})
  	}

  	getPlaces = () => {
  		if(this.markers.length !== 0){
  			this.removeMarkers()
  			this.bounds = new window.google.maps.LatLngBounds()
  		}

  		const self = this

		const input = document.getElementById('placesSearch').value;
		const proxyurl = "https://cors-anywhere.herokuapp.com/"
		const url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" +input +"&location=39.1836,-96.5717&radius=100&key=AIzaSyB9R7iubdV_Xn3N9A8m_90v-0SyYZ4DhUg"
		fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
		.then(response => response.json())
		.then(function(contents){
			contents.results.forEach((restaurant) => {
				self.restaurants.push(restaurant)
				self.completeRestaurantsList.push(restaurant)
			})
			self.setState(() => ({refresh:'yes'}))
		})
		.catch((e) => console.log(e))
  	}

  	//Removes the markers from the map and erases the array.
  	removeMarkers = () => {
  		for (var i = 0; i < this.markers.length; i++) {
        	this.markers[i].setMap(null);
        }

        this.markers = []
        this.restaurants = []

        this.setState(() => ({refresh:'yes'}))
  	}

  	//Places the markers on the map
  	dropMarker = (restaurant) => {
  		var map = this.state.map
  		var bounds = this.bounds

  		var marker = new window.google.maps.Marker({
	    	map: map,
	   		position: {lat: restaurant.geometry.location.lat, lng: restaurant.geometry.location.lng},
    		title: restaurant.name,
    		animation: window.google.maps.Animation.DROP,
    		id: restaurant.id
		});

		bounds.extend(marker.position)
		map.fitBounds(bounds)
		if(map.getZoom() > 16){
			map.setZoom(16)
		}

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
  		this.infoWindow.setContent(
  				`<div className='infoWindow'>
					<h2 class='centerText'>${businessInfo.name}</h2>
					<p><b>Address: </b>${businessInfo.location.display_address[0]}, ${businessInfo.location.display_address[1]}</p>
					<p><b>Phone: </b>${businessInfo.display_phone}</p>
					<p><b>Yelp Rating: </b>${businessInfo.rating} stars from ${businessInfo.review_count} reviews</p>
					<p><b>Yelp Website: </b><a href='${businessInfo.url}' target='_blank'>${businessInfo.name}</a></p>
				</div>`
			)
  		this.infoWindow.open(this.state.map, marker)
  	}

  	//Pops up a loading info window and gathers all of the information for the info window. Fetches the restraunt information through the Yelp API. Sends it all to the openInfoWindow function to complete the process.
  	createAndOpenInfoWindow = (restaurant) => {
  		var marker = this.getMarker(restaurant)
  		var bounds = new window.google.maps.LatLngBounds()
  		var map = this.state.map
  		var app = this

  		bounds.extend(marker.position)
		map.fitBounds(bounds)
		map.setZoom(16)

  		marker.setAnimation(window.google.maps.Animation.BOUNCE)
      	setTimeout(function(){marker.setAnimation(null)}, 1000)

  		this.infoWindow.setContent(`<div>Loading...</div>`)
  		this.infoWindow.open(this.state.map, marker)

		const apiKey = "qRuURpX1yy2KItA1p3K4daciEhOhqRNKKqxCR72jVjGvDZkJGoUls2-sjLfS8JXzPRIlKqIATD2nNqZDg3Jl-fZGhQNcOTlyP6LI28T8-MTAxJb2wuTYixTd6HHmW3Yx";
		let myHeaders = new Headers();
		myHeaders.append("Authorization", "Bearer " + apiKey);
		const proxyUrl = "https://cors-anywhere.herokuapp.com/"

		fetch(proxyUrl +"https://api.yelp.com/v3/businesses/search?location=" +restaurant.formatted_address +"&term=" +restaurant.name, {headers: myHeaders})
		.then(response => response.json())
		.then(businessIdArray => businessIdArray.businesses[0])
		.then(function(businessInfo){
			app.openInfoWindow(marker, businessInfo)
		})
		.catch(function(){
			app.infoWindow.setContent(`<div>Our apologies. An error occured when loading the information for this location.</div>`)
  			app.infoWindow.open(app.state.map, marker)
		})
  	}

  	//Function to handle what happens when the hamburger menu is clicked.
  	hamburgerClick = () => {
  		var menuContainter = document.getElementById('menuContainter')

  		if(menuContainter.style.visibility === 'hidden'){
  			menuContainter.style.visibility = 'visible'
  			if(window.innerWidth >= 749){
  				document.getElementById('menu').style.width = "20vw"
  			}else{
  				document.getElementById('menu').style.width = "60vw"
  			}
  			
  		}
  		else{
  			menuContainter.style.visibility = 'hidden'
  			document.getElementById('menu').style.width = "45px"
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
	        			<h4 className='searchBusinesses'>Search for Businesses</h4>
	        			<div className='form'>
	        				<input type="text" id="placesSearch" placeholder="Search" onKeyPress={(e) => (e.keyCode === 13) && (this.getPlaces)} />
	        				<button className="submit" onClick={this.getPlaces}> Submit </button>
						</div>
	        			<div id='menuList'>
	        				{this.restaurants !== undefined && this.restaurants.map((restaurant) =>
	        					<div key={restaurant.id} tabIndex={0} aria-label={restaurant.name} onKeyPress={(e) => (e.keyCode === 0) && (this.createAndOpenInfoWindow(restaurant))} onClick={() => (this.createAndOpenInfoWindow(restaurant))}>
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