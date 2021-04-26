This project is a frontend technical test for a job application.

The objective is to retrieve data from a weather API and display cities from Nepal on a map and a selected city weather forecast on a chart.

## Notes

I selected React as a frontend lib and HighCharts as the chart lib as these were the recommended options.

I implemented the map using OpenLayers (instead of the more common Leaflet) because I wanted to improve my knowledge of this library.

I experienced CORS issues using the provided API (the preflight request requires credentials but the CORS header ‘Access-Control-Allow-Origin’ is ‘\*’ : see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSNotSupportingCredentials).

So I opted to download the necessary data as JSON files and to fetch them from the public/data folder.

## Running the app

Using Docker: `docker-compose up`
The app should be available on http://localhost:3003

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

Install node >= 12 and yarn (or npm)

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
