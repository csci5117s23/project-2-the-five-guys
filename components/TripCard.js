import { Card, CardActionArea, CardContent, CardMedia, Link, Typography } from "@mui/material";
import { formatDate } from "../modules/util";

export default function TripCard({ trip }) {
  return (
    <Card>
      <CardActionArea component={Link} href={`/trip/${trip._id}`}>
        <CardMedia component="img" height="140" loading="lazy" image={trip.imageUrl} alt="trip image" />
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
