import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "1000px",
  height: "800px",
};

const center = {
  lat: 18.5204,
  lng: 73.8567,
};

const Drone = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDWzus96n6vzsziFdZ_LjMZ_2chBOUKAUM",
  });

  const [startLatitude, setStartLatitude] = useState(0);
  const [startLongitude, setStartLongitude] = useState(0);
  const [endLatitude, setEndLatitude] = useState(0);
  const [endtLongitude, setEndtLongitude] = useState(0);
  const [time, setTime] = useState(0);
  const [dronePosition, setDronePosition] = useState(null);
  const [path, setPath] = useState([]);
  const [paths, setPaths] = useState([]);
  const [idx, setIdx] = useState(0);

  const handleStartLatitudeChange = (e) => {
    setStartLatitude(e.target.value);
  };

  const handleEndLatitudeChange = (e) => {
    setEndLatitude(e.target.value);
  };

  const handleStartLongitudeChange = (e) => {
    setStartLongitude(e.target.value);
  };

  const handleEndLongitudeChange = (e) => {
    setEndtLongitude(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(Number(e.target.value));
  };

  const handleReset = () => {
    setStartLatitude(0);
    setEndLatitude(0);
    setStartLongitude(0);
    setEndtLongitude(0);
    setTime(0);
  };
  function getIntermediateCoordinates(
    startLat,
    startLng,
    endLat,
    endLng,
    numSteps
  ) {
    const coordinates = [];

    for (let i = 0; i <= numSteps; i++) {
      const fraction = i / numSteps;
      const intermediateLat = startLat + fraction * (endLat - startLat);
      const intermediateLng = startLng + fraction * (endLng - startLng);
      coordinates.push({ lat: intermediateLat, lng: intermediateLng });
    }

    return coordinates;
  }

  useEffect(() => {
    const timmer = setTimeout(() => {
      if (idx < paths.length) {
        setPath((prev) => [...prev, paths[idx]]);
        setIdx((prev) => prev + 1);
      }
      console.log(idx);
    }, 1500);

    return () => {
      clearTimeout(timmer);
    };
  }, [paths, idx, path]);

  function getIntermediateCoordinates(
    startLat,
    startLng,
    endLat,
    endLng,
    timeInterval
  ) {
    const coordinates = [];
    const numSteps = Math.floor(timeInterval / 1000);

    for (let i = 0; i <= numSteps; i++) {
      const fraction = i / numSteps;
      const intermediateLat = startLat + fraction * (endLat - startLat);
      const intermediateLng = startLng + fraction * (endLng - startLng);
      coordinates.push({ lat: intermediateLat, lng: intermediateLng });
    }

    return coordinates;
  }

  const handleSimulateClick = () => {
    const latNum = Number(startLatitude);
    const lngNum = Number(startLongitude);
    setDronePosition({ lat: latNum, lng: lngNum });
    setPath((prevPath) => [...prevPath, { lat: latNum, lng: lngNum }]);
    const coordinates = getIntermediateCoordinates(
      Number(startLatitude),
      Number(startLongitude),
      Number(endLatitude),
      Number(endtLongitude),
      Number(time)
    );
    setPaths(coordinates);
  };

  return isLoaded ? (
    <>
      <div>
        <h1 className="mb-2 mt-0 text-6xl font-medium leading-tight text-black p-3">
          Drone Simulator
        </h1>
        <div className="flex flex-col gap-5">
          <div>
            <label className="p-4 text-2xl font-medium">Start Latitude:</label>
            <input
              className="shadow appearance-none border rounded w-[50%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={startLatitude}
              type="text"
              onChange={handleStartLatitudeChange}
              placeholder="Enter Latitude"
            ></input>
          </div>
          <div>
            <label className="p-4 text-2xl font-medium">Start Longitude:</label>
            <input
              type="text"
              placeholder="Enter Longitude"
              className="shadow appearance-none border rounded w-[50%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={startLongitude}
              onChange={handleStartLongitudeChange}
            />
          </div>
          <div>
            <label className="p-4 text-2xl font-medium">End Latitude:</label>
            <input
              type="text"
              placeholder="End Latitude"
              value={endLatitude}
              onChange={handleEndLatitudeChange}
              className="shadow appearance-none border rounded w-[50%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="p-4 text-2xl font-medium">End Longitude:</label>
            <input
              type="text"
              placeholder="End Longitude"
              value={endtLongitude}
              className="shadow appearance-none border rounded w-[50%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleEndLongitudeChange}
            />
          </div>
          <div>
            <label className="p-4 text-2xl font-medium">
              Time (in milliseconds):
            </label>
            <input
              type="number"
              id="time"
              placeholder="Enter time"
              onChange={handleTimeChange}
              className="shadow appearance-none border rounded w-[50%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  justify-center w-[30%] m-10"
              onClick={handleSimulateClick}
            >
              Simulate
            </button>
            <button
              className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded  justify-center w-[30%] m-10"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>

        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
          {dronePosition && (
            <Marker icon={<FaMapMarkerAlt />} position={dronePosition} />
          )}
          {paths.length > 1 && (
            <Polyline path={path} options={{ strokeColor: "#FF0000" }} />
          )}
        </GoogleMap>
      </div>
    </>
  ) : (
    <></>
  );
};

export default Drone;
