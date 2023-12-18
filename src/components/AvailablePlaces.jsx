import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js'
import { FetchDataFromBackend } from './http.jsx';
export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetch, setIsFetch] = useState(true);
  const [availablePlaces, setAvialablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetch(true);
      try {
        const data = await FetchDataFromBackend();
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(data, position.coords.latitude, position.coords.longitude);
          setAvialablePlaces(sortedPlaces);
          setIsFetch(false);
        })
      }
      catch (error) {
        setError({ message: error.message || "Couldn't fetch places!" })
        setIsFetch(false);
      }
    }
    fetchPlaces();
  }, [])

  if (error) {
    return <Error title={"Error"} message={error.message} />
  }

  return (
    <Places
      title="Available Places"
      isFetch={isFetch}
      dataFetchMessage="Data is fetching..."
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
