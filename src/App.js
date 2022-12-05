import './App.css';
import React, { useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import Map from './components/Map';
import Header from './components/Header';

function App() {
	const [input, setInput] = useState({
		jobTitle: '',
		zipCode: '',
	});
	const [coords, setCoords] = useState({
		lat: '',
		long: '',
	});
	const [searchResults, setSearchResults] = useState({});

	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
	});
	if (!isLoaded) {
		return <div>Loading...</div>;
	}

	function handleSubmitInput(event) {
		event.preventDefault();
		if (input.zipCode.length !== 5) {
			alert('Please enter valid US zip code');
		}
		let postalCode = input.zipCode;
		let [first, last] = input.jobTitle.split(' ');
		if (!last) {
			last = '';
		}
		getAdzuna(postalCode, first, last);
		getGeocode(postalCode);
	}
	function handleChange(e) {
		const value = e.target.value;
		setInput({
			...input,
			[e.target.name]: value,
		});
	}
	async function getAdzuna(postalCode, first, last) {
		const link = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${process.env.REACT_APP_ADZUNA_ID}&app_key=${process.env.REACT_APP_ADZUNA_API_KEY}&results_per_page=20&what=${first}%20${last}&where=${postalCode}&content-type=application/json`;

		try {
			const response = await fetch(link);
			let data = await response.json();
			setSearchResults(data);
		} catch (error) {
			console.log(error);
		}
	}

	async function getGeocode(postalCode) {
		const link = `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=${process.env.REACT_APP_GEO_API_KEY}`;
		try {
			const response = await fetch(link);
			let data = await response.json();
			const lat = data.results[0].geometry.location.lat;
			const long = data.results[0].geometry.location.lng;
			setCoords((prev) => {
				return { ...prev, lat: lat, long: long };
			});
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<div className="App">
			<Header />
			<form onSubmit={handleSubmitInput} className="form">
				<input type="text" placeholder="Job Title" name="jobTitle" value={input.jobTitle} onChange={handleChange}></input>
				<input type="number" placeholder="Zip Code" name="zipCode" value={input.zipCode} onChange={handleChange}></input>
				<button className="submit-button">Submit</button>
			</form>
			<Map data={searchResults} lat={coords.lat} long={coords.long} />
		</div>
	);
}

export default App;
