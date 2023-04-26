/*
 * Auto generated Codehooks (c) example
 * Install: npm i codehooks-js codehooks-crudlify
 */
import { app } from "codehooks-js";
import { crudlify } from "codehooks-crudlify";
import { object, date, string, array, number } from "yup";
import jwtDecode from "jwt-decode";

const tripYup = object({
  userId: string().required(),
  nationalPark_id: string().required(),
  startDate: date().required(),
  endDate: date().required(),
  notes: string(),
  itinerary: array().of(
    object({
      startDate: date().required(),
      endDate: date().required(),
      description: string().required(),
      latitude: number(),
      longtitude: number(),
      notes: string(),
      location: string(),
    })
  ),
});

// COPIED FROM EXAMPLE
// This can largely be copy-pasted, it just grabs the authorization token and parses it, stashing it on the request.
const userAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.replace("Bearer ", "");
      // NOTE this doesn't validate, but we don't need it to. codehooks is doing that for us.
      const token_parsed = jwtDecode(token);
      req.user_token = token_parsed;
    }
    next();
  } catch (error) {
    next(error);
  }
};
app.use(userAuth);

// COPIED FROM EXAMPLE
// some extra logic for GET / and POST / requests.
app.use("/trips", (req, res, next) => {
  if (req.method === "POST") {
    // always save authenticating user Id token.
    // note -- were not enforcing uniqueness which isn't great.
    // we don't currently have a great way to do this -- one option would be to
    // have a user collection track which collections have been filled
    // It's a limitation for sure, but I'll just make that a front-end problem...
    req.body.userId = req.user_token.sub;
  } else if (req.method === "GET") {
    // on "index" -- always check for authentication.
    req.query.userId = req.user_token.sub;
  }
  next();
});

// COPIED FROM EXAMPLE
// some extra logic for GET /id and PUT /id DELETE /id PATCH /id requests.
// side effect here will break patch patch by query, but that's OK for my purposes.
app.use("/trips/:id", async (req, res, next) => {
  const id = req.params.ID;
  const userId = req.user_token.sub;
  // let's check access rights for the document being read/updated/replaced/deleted
  const conn = await Datastore.open();
  try {
    console.log(id);
    const doc = await conn.getOne("trips", id);
    if (doc.userId != userId) {
      // authenticate duser doesn't own this document.
      res.status(403).end(); // end is like "quit this request"
      return;
    }
  } catch (e) {
    console.log(e);
    // the document doesn't exist.
    res.status(404).end(e);
    return;
  }
  // if we don't crash out -- call next and let crudlify deal with the details...
  next();
});

app.put("/updateParkItem", updateParkItem);
async function updateParkItem(req, res) {
  const database = await Datastore.open();
  const data = await database.updateOne("tripItem", req.query._id, req.body);
  res.json(data);
}

// Use Crudlify to create a REST API for any collection
crudlify(app, { tripItem: tripYup });
// test route for https://<PROJECTID>.api.codehooks.io/dev/

// bind to serverless runtime
export default app.init();
