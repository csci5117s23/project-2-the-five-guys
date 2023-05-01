import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import myTripStyles from "@/styles/MyTrip.module.css";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useState } from 'react';

export default function ShareComponent(props) {
    const [open, setOpen] = useState(false);
    const trip = props.trip;
    const park = props.park;
    const start = props.start;
    const end = props.end;
    if(trip && park){
      let itineraryListText = "";
      if(trip.itinerary){
        trip.itinerary.map(item => {
          let startDate = new Date(item.startDate);
          let endDate = new Date(item.endDate);
          itineraryListText += startDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) + " - " + endDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
          if(item.location){
            itineraryListText+=": " +item.location;
          }
          if(item.description){
            itineraryListText+=": " +item.description;
          }
          itineraryListText += "\n";
        });
      }else{
        itineraryListText = "No itinerary!";
      }
      function handleClose() {
        setOpen(false);
      }
      const shareData = {
          title: "Trip to " + park.name + " from " + start + " to " + end,
          text: "Itinerary:\n"+ itineraryListText + "\n"
        };
      if (trip.notes) shareData.text += trip.notes;

        async function shareTrip(){
          try {
              if (navigator.share) {
                await navigator.share(shareData);
              } else {
                setOpen(true);
              }
          } catch (err) {
              console.log(err)
          }
        }

        return (
          <>
            <Button variant="outlined" onClick={shareTrip} startIcon={<SendIcon />}>
              Share Trip
            </Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Error</DialogTitle>
              <DialogContent>
                <DialogContentText>Sharing is not supported by your browser.</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>OK</Button>
              </DialogActions>
            </Dialog>
          </>
        );
    }
}
