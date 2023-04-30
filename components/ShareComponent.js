import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import myTripStyles from "@/styles/MyTrip.module.css";

export default function ShareComponent(props) {
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
      const shareData = {
          title: "Trip to " + park.name + " from " + start + " to " + end,
          text: "Itinerary:\n"+ itineraryListText + "\n" + trip.notes
        };

        async function shareTrip(){
          try {
              await navigator.share(shareData);
            } catch (err) {
              console.log(err)
            }
        }

        return(
          <>
          <Button className={myTripStyles.deleteButton} variant="outlined" onClick={shareTrip} startIcon={<SendIcon />}>Share Trip</Button>
          </>
        )
    }
}