import ExploreParkItem from "./ExploreParkItem";
import { Container, Stack, Box, List, ListItem, Typography, Fab, Divider, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function ExploreParkItemList(props) {  
  let nationalParks = props.nationalParks;
  const searchValue = props.searchValue.toLowerCase();

  // Filter national parks by search item
  if(searchValue.length > 0){
    const result = nationalParks.filter((element) =>
      element.name.toLowerCase().includes(searchValue)
    );
    nationalParks = result;
  } 

  // Build list of parks
  const parkList = nationalParks.map((park, index)=> {
    return(
      <Grid item xs={12} md={6} key={index}>
        <ExploreParkItem nationalPark={park} />
      </Grid>
    );
  });

  return (
    // <Stack className="parkStack" spacing={2}>
    //   {parkList}
    // </Stack>
    <Box>
      <Container>
        <List>
          <ListItem>
            <Stack
              direction='row'
              justifyContent='space-between'
              spacing={2}
              alignItems='center'
            >
              <Typography variant="h1"> All National Parks </Typography>
              <Fab
                color='green'
                aria-label='add'
              >
                <AddIcon />
              </Fab>
            </Stack>
          </ListItem>

          <Divider />

          <ListItem>
            <Grid container spacing={2} justifyContent='center'>
              {parkList}
            </Grid>
          </ListItem>
        </List>
      </Container>
    </Box>
  );
}