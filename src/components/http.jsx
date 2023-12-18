export async function FetchDataFromBackend() {

    const response = await fetch("http://localhost:3000/places");
    const data = await response.json();
    if (!response.ok) {
        throw new Error("Failed to fetch places");
    }

    return data.places;
}

export async function UpdateUserPlaces(places) {
    const response = await fetch("http://localhost:3000/user-places", {
        method: 'PUT',
        body: JSON.stringify({ places }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error('Failed to update user data!');
    }

    return data.message;
}

export async function FetchUserPlacesData() {

    const response = await fetch("http://localhost:3000/user-places");
    const data = await response.json();
    if (!response.ok) {
        throw new Error("Failed to fetch places");
    }

    return data.places;
}
