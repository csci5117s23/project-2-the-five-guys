import { avoidRateLimit } from "./util";

const apiKey = process.env.NEXT_PUBLIC_NATIONAL_PARK_KEY;
const BASE_API_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getNationalParks()
{
  // await avoidRateLimit();
  let response = await fetch(`https://developer.nps.gov/api/v1/parks?limit=950`, {
    method: 'GET',
    headers: {
      'x-api-key': `${apiKey}`,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
    }
  });
  return await response.json();
}

//get park places by parkcode from get parks endpoint
export async function getParkPlaces(parkCode)
{
  let response = await fetch(`https://developer.nps.gov/api/v1/places?parkCode=${parkCode}&limit=950`, {
    method: 'GET',
    headers: {'x-api-key': `${apiKey}`}
  });
  return await response.json();
}

export async function getTrips(authToken) {
  const response = await fetch(`${BASE_API_URL}/trips`, {
      method:'GET',
      headers: {'Authorization': 'Bearer ' + authToken}
  });
  return await response.json();
}

export async function createTrip(authToken, trip) {
  const response = await fetch(`${BASE_API_URL}/trips`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + authToken
      },
      body: JSON.stringify(trip),
  });
  return await response.json();
}
