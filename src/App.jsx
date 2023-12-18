import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { FetchUserPlacesData, UpdateUserPlaces } from './components/http.jsx';
import Error from './components/Error.jsx';

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const [errorMessageUpdate, setErrorMessageUpdate] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [isFetch, setIsFetch] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchUserPlaces() {
      setIsFetch(true);
      try {
        const places = await FetchUserPlacesData();
        setUserPlaces(places);
      } catch (error) {
        setError({ message: error.message || "Can't fetch data!" })
      }
      setIsFetch(false);
    }
    fetchUserPlaces();
  }, [])
  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {

    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    try {
      await UpdateUserPlaces([selectedPlace, ...userPlaces]);
    }
    catch (error) {
      setUserPlaces(userPlaces);
      setErrorMessageUpdate({
        message: error.message || "Can't update user places!"
      })
    }
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );
    try {
      await UpdateUserPlaces(userPlaces.filter((place) => place.id !== selectedPlace.current.id));
    }
    catch (error) {
      setUserPlaces(userPlaces);
      setErrorMessageUpdate({
        message: error.message || "Can't update user places!"
      })
    }
    setModalIsOpen(false);
  }, [userPlaces]);

  function handleErrorRemove() {
    setErrorMessageUpdate(null);
  }
  return (
    <>
      <Modal open={errorMessageUpdate} onClose={handleErrorRemove}>
        {errorMessageUpdate &&
          <Error title="Error occured!" message={errorMessageUpdate.message} onConfirm={handleErrorRemove}></Error>
        }
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Afghan world" />
        <h1>Afghan Explorer</h1>
        <p>
          Curate your exclusive collection of destinations you aspire to explore!
        </p>
      </header>
      <main>
        {error && <Error title="Error occured!" message={error.message}></Error>}
        {!error && <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          isFetch={isFetch}
          dataFetchMessage="Dta is fetching..."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        }

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
