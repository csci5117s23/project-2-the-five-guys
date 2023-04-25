import Link from 'next/link';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import abbrState from './GetFullStateName';

export default function ExploreParkItem(props) {
  // Set appropriate park link based on props
  const {nationalPark} = props;
  let parkLink = "parks/" + nationalPark.id;

  // TODO: remove this
  if(nationalPark.name === 'Death Valley'){
    console.log(nationalPark);
  }

  // Convert state abbreviations into full names
  let statesList = nationalPark.states.split(',');
  statesList = statesList.map((state) => {
    return abbrState(state);
  });

  return(
    <Link className='exploreParkLink' href={parkLink}>
      <Card>
        <CardActionArea>
          {/* Main image of park */}
          <CardMedia
            component='img'
            height='140'
            image={nationalPark.images[0].url}
            alt={nationalPark.name}
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
              {nationalPark.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}