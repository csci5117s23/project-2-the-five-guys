import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Link,
  Typography,
} from "@mui/material";

export default function PlaceCard({ place, handleOpen, handleCreateOpen }) {
  return (
    <Card>
      <CardActionArea onClick={() => handleOpen(place)}>
        <CardMedia component="img" height="140" loading="lazy" image={place.images[0].url} alt="place image" onError={(event) => event.target.style.display = 'none'} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" noWrap>
            {place.title}
          </Typography>
          <Typography variant="body2">{place.listingDescription}</Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" onClick={() => handleCreateOpen(place)}>Add to trip</Button>
        <Button size="small" onClick={() => handleOpen(place)}>More Info</Button>
      </CardActions>
    </Card>
  );
}
