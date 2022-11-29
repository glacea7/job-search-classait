import React, { useState } from 'react';
import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api';

export default function Map(props) {
	const [map, setMap] = useState(/**@type google.maps.Map */ (null));
	const [hover, setHover] = useState(false);
	const [selected, setSelected] = useState(null);
	let center = { lat: 40.73061, lng: -73.935242 };

	if (props.lat && props.long) {
		let a = { lat: props.lat, lng: props.long };
		center = a;
	}

	function getSalary() {
		if (selected.salary_max) {
			return <p>Salary: ${Math.floor(selected.salary_max)}</p>;
		} else return <p>Salary: </p>;
	}

	return (
		<div className="google-map">
			<GoogleMap zoom={11} center={center} mapContainerClassName="map-container" onLoad={(map) => setMap(map)}>
				{props.data.results ? (
					props.data.results.map((marker) => {
						return (
							<Marker
								key={marker.id}
								position={{
									lat: marker.latitude,
									lng: marker.longitude,
									title: marker.company.display_name,
								}}
								onMouseOver={() => {
									setHover(true);
									setSelected(marker);
								}}
							/>
						);
					})
				) : (
					<Marker position={center} />
				)}
				{hover ? (
					<InfoWindow
						position={{ lat: selected.latitude, lng: selected.longitude }}
						onCloseClick={() => {
							setHover(false);
						}}
					>
						<div className="info-window">
							<h1>{selected.company.display_name}</h1>
							<p>{selected.title}</p>
							<p>{getSalary()}</p>
							<p>{selected.location.display_name}</p>
						</div>
					</InfoWindow>
				) : null}
				{console.log(selected)}
			</GoogleMap>
		</div>
	);
}
