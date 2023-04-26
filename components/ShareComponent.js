import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';

export default function ShareComponent(props) {
    const trip = props.trip;
    const park = props.park;
    let itineraryListText = "";
    trip.itinerary.map(item => {
      itineraryListText += item.startDate + " - " + item.endDate + ": " + item.description + "\n"
    });
    const shareData = {
        title: "Trip to " + park.name + " from " + trip.startDate + " to " + trip.endDate,
        text: "Itinerary:\n"+ itineraryListText + "\n" + trip.notes
        // url: "https://developer.mozilla.org",
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
        <Button variant="text" onClick={shareTrip} endIcon={<SendIcon />}>Share</Button>
        </>
      )
}