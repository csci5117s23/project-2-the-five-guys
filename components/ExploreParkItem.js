import Link from 'next/link';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import abbrState from './GetFullStateName';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function ExploreParkItem(props) {
  // Set appropriate park link based on props
  const nationalPark = props.nationalPark;
  let parkLink = "parks/" + nationalPark.id;

  // Read in whether or not this park has been visited
  const visited = props.visited

  // const maxDescriptionLength = 300;

  // Convert state abbreviations into full names
  let statesList = nationalPark.states.split(',');
  statesList = statesList.map((state) => {
    return abbrState(state);
  });

  // Truncate description if too long
  let parkDescription = nationalPark.description;
  // if(parkDescription.length > maxDescriptionLength){
  //   parkDescription = parkDescription.slice(0, maxDescriptionLength) + '...';
  // }


  // Check if this park has been visited by this user
  // let visited = true;

  return(
    <Link className='exploreParkLink' href={parkLink}>
      <Card style={{ border: visited? '1px solid #1B742E' : '' }}>
        <CardActionArea>
          {/* Main image of park */}
          <CardMedia
            component='img'
            height='140'
            image={nationalPark.images[0].url}
            alt={nationalPark.images[0].alt}
          />
          <CardContent>
            {/* Title of park and checkmark if this park has been visited */}
            <Typography variant='h5' component='div'>
              {nationalPark.name}
              { visited && (
                <CheckCircleIcon color='primary' style={{ marginLeft: '5px' }} />
              )}
            </Typography>
            
            {/* Location of park */}
            <Typography variant='subtitle1'>
              {statesList.join(', ')}
            </Typography> 

            {/* Description of park */}
            <Typography variant='body2'>
              {parkDescription}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}