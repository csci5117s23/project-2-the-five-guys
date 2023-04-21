import { Box, Divider, List, ListItem, Typography, Stack, Fab, Grid, Button, CardActions, CardContent, Card } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Container from '@mui/material/Container';

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
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      Word of the Day
                    </Typography>
                    <Typography variant="h5" component="div">
                      benevolent
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      adjective
                    </Typography>
                    <Typography variant="body2">
                      well meaning and kindly.
                      <br />
                      {'"a benevolent smile"'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      Word of the Day
                    </Typography>
                    <Typography variant="h5" component="div">
                      benevolent
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      adjective
                    </Typography>
                    <Typography variant="body2">
                      well meaning and kindly.
                      <br />
                      {'"a benevolent smile"'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </ListItem>
        </List>
      </Container>
    </Box>
  );
}
