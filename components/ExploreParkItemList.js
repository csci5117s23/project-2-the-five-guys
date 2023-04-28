import ExploreParkItem from "./ExploreParkItem";
import { ListItem, Grid } from "@mui/material";
import abbrState from "../modules/util";

export default function ExploreParkItemList(props) {  
  let nationalParks = props.nationalParks;
  let visitedParks = props.visitedParks;
  const searchValue = props.searchValue.toLowerCase();

  // Callback function to filter parks by both the states they are
  // located in and by their names.
  function filterElements(element){
    // Convert state abbreviations into full names
    let statesList = element.states.split(',');
    statesList = statesList.map((state) => {
      return abbrState(state);
    });

    return element.name.toLowerCase().includes(searchValue) ||
            statesList.some(function(elem) {
              return elem.toLowerCase().includes(searchValue);
            });
  }

  // Filter national parks by search item
  if(searchValue.length > 0){
    const result = nationalParks.filter(filterElements);
    nationalParks = result;
  } 

  // Build list of parks using MUI Grid component
  const parkList = nationalParks.map((park, index)=> {
    return(
      <Grid item xs={12} md={6} key={index}>
        <ExploreParkItem nationalPark={park} visited={visitedParks.includes(park.id)}/>
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