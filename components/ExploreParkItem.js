import Link from 'next/link';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import abbrState from './GetFullStateName';

export default function ExploreParkItem(props) {
  // Set appropriate park link based on props
  const {nationalPark} = props;
  let parkLink = "parks/" + nationalPark.id;

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

  return(
    <Link className='exploreParkLink' href={parkLink}>
      <Card>
        <CardActionArea>
          {/* Main image of park */}
          <CardMedia
            component='img'
            height='140'
            image={nationalPark.images[0].url}
            alt={nationalPark.images[0].alt}
          />
          <CardContent>
            {/* Title of park */}
            <Typography gutterBottom variant='h5' component='div' noWrap>
              {nationalPark.name}
            </Typography>
            
            {/* Location of park */}
            <Typography gutterBottom>
              {statesList.join(', ')}
            </Typography> 

            {/* Description of park */}
            <Typography variant='body2' color='#1B742E'>
              {parkDescription}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}