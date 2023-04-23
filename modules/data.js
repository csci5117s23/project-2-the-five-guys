import { start } from "repl";

const backend_base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

//fetch data general trip page
export async function fetchItemData(userId, setData, authToken) {
  if(userId){
    const response = await fetch(backend_base+`/tripItem?userId=${userId}`, {
      'method':'GET',
      'headers': {'Authorization': 'Bearer ' + authToken, 'Accept': 'application/json'}
    })
    const data = await response.json()
    setData(data);
  }
}

//fetch data specific trip
export async function fetchItemData(userId, tripId, setData, authToken) {
    if(userId && tripId){
      const response = await fetch(backend_base+`/tripItem?userId=${userId}&_id=${tripId}`, {
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken, 'Accept': 'application/json'}
      })
      const data = await response.json()
      setData(data[0]);
    }
} 

// add a trip to the database
export async function postDataUnchecked(userId, authToken, nationalPark_id, startDate, endDate) {
    const response = await fetch(backend_base+'/tripItem', {
      'method':'POST',
          'headers': {'Authorization': 'Bearer ' + authToken,
          'Content-Type': 'application/json'},
          'body': JSON.stringify({'userId':userId,
            'nationalPark_id':nationalPark_id,
            'startDate':startDate,
            'endDate':endDate})
    }); 
    return response;
  }

// update parkItem to have the new info
export async function updateParkItem(updatedTrip, authToken){
    const response = await fetch(backend_base+'/updateParkItem?_id='+updatedTrip._id, {
      'method':'PUT',
          'headers': {'Authorization': 'Bearer ' + authToken,
          'Content-Type': 'application/json'},
          'body': JSON.stringify(updatedTrip)
    }); 
    return await response.json();
  }