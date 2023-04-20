const apiKey = process.env.NEXT_PUBLIC_NATIONAL_PARK_KEY;

export async function getNationalParks() 
{
    let response = await fetch(`https://developer.nps.gov/api/v1/parks?limit=950`, {
        method: 'GET',
        headers: {'x-api-key': `${apiKey}`}
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