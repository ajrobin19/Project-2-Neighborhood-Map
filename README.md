# Neighborhood Map



## Running the Application
To open app:

* install all project dependencies with `npm install`
* start the development server with `npm start`


### Map
The application uses the Google Maps API to display the map, place the markers, and display the info windows. The markers and list in the sidebar can be clicked to display important information about the restaurant.

### Filter
At the top of the sidebar is a filter option, in which the user can filter the restaurants that appear in the list and on the map. To return the map and list back to normal the filter needs to be on none.

### Yelp API
The application utilizes the Yelp API to gain information about the restaurant. This information used is used in the info windows that appear when the marker or list item is clicked.

### Service Worker
The service worker works in production mode. To get to production mode follow the steps below

Run the following on the commmand line:
* npm run build
* serve -s build

And then visit:
* localhost:5000