import ExploreParkItem from "./ExploreParkItem";
import { Stack } from "@mui/material";

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
      <ExploreParkItem key={index} nationalPark={park} />
    );
  });

  return (
    <Stack className="parkStack" spacing={2}>
      {parkList}
    </Stack>
  );
}