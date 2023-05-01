import { useAuth } from "@clerk/nextjs";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { updateTrip } from "../modules/requests";

export default function NotesTab({ trip }) {
  const [newNotes, setNewNotes] = useState(trip.notes);
  const { getToken } = useAuth();
  async function handleNotes() {
    try {
      const token = await getToken({ template: "codehooks" });

      const response = await updateTrip(token, trip._id, { notes: newNotes });
      setNewNotes(response.notes);
    } catch (error) {
      console.error("Notes error: ", error);
    }
  }
  return (
    <>
      <TextField sx={{ my: 2 }} label="Add trip notes here" multiline fullWidth value={newNotes} onChange={(e) => setNewNotes(e.target.value)} />
      <Button variant="contained" onClick={() => handleNotes()}>Save</Button>
    </>
  );
}
