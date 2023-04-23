
/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import { object, date, string, array, number } from 'yup';

const tripYup = object({
  userId: string().required(),
  nationalPark_id: string().required(),
  startDate: date().required(),
  endDate: date().required(),
  notes: string(),
  itinerary: array().of(object({
    startDate: date().required(),
    endDate: date().required(),
    description: string().required(),
    latitude: number(),
    longtitude: number(),
    notes: string()
  }))
});

app.put('/updateParkItem', updateParkItem)
async function updateParkItem(req, res) {
    const database = await Datastore.open();
    const data = await database.updateOne('tripItem', req.query._id, req.body);
    res.json(data);
}

// Use Crudlify to create a REST API for any collection
crudlify(app, {tripItem: tripYup})
// test route for https://<PROJECTID>.api.codehooks.io/dev/

// bind to serverless runtime
export default app.init();
