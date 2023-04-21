import {
  Box,
  Divider,
  List,
  ListItem,
  Typography,
  Stack,
  Fab,
  Grid,
  CardContent,
  Card,
  CardActionArea,
  CardMedia,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";

export default function TripListPage() {
  return (
    <Box>
      <Container>
        <List>
          <ListItem>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={2}
              alignItems="center"
            >
              <Typography variant="h3">My Trips</Typography>
              <Fab color="primary" aria-label="add">
                <AddIcon />
              </Fab>
            </Stack>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} md={6}>
                <Card>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image="https://www.nps.gov/common/uploads/structured_data/3C7B12D1-1DD8-B71B-0BCE0712F9CEA155.jpg"
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        Grand Canyon
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        January 1 - January 1, 2023
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image="https://www.nps.gov/common/uploads/structured_data/3C7B12D1-1DD8-B71B-0BCE0712F9CEA155.jpg"
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        Grand Canyon
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        January 1 - January 1, 2023
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          </ListItem>
        </List>
      </Container>
    </Box>
  );
}
