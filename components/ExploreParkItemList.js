import ExploreParkItem from "./ExploreParkItem";
import { ListItem, Grid } from "@mui/material";

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

  // Build list of parks using MUI Grid component
  const parkList = nationalParks.map((park, index)=> {
    return(
      <Grid item xs={12} md={6} key={index}>
        <ExploreParkItem nationalPark={park} />
      </Grid>
    );
  });

  return (
    <ListItem>
      <Grid container spacing={2} justifyContent='center'>
        {parkList}
      </Grid>
    </ListItem>
  );
}