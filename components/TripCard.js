import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { formatDate } from "../modules/util"

export default function TripCard({ trip }) {
  return (
    <Card>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={trip.imageUrl}
          alt="trip image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" noWrap>
            {trip.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
