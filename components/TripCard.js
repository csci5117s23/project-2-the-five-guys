import { Card, CardActionArea, CardContent, CardMedia, Link, Typography, IconButton, Box } from "@mui/material";
import { formatDate } from "../modules/util";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "@clerk/nextjs";
import { deleteTrip } from "@/modules/data";


export default function TripCard({ trip, setReload }) {
  const { isLoaded, userId, getToken } = useAuth();
  async function handleDelete(){
    const token = await getToken({ template: "codehooks" });
    const result = await deleteTrip(token, trip._id);
    setReload(true);
  }

  return (
    <Card>
      <CardActionArea component={Link} href={`/trip/${trip._id}`}>
        <CardMedia component="img" height="140" loading="lazy" image={trip.imageUrl} alt="trip image" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" noWrap>
            {trip.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {trip.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end" >
        <IconButton onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
}
