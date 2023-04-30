import Link from 'next/link';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import abbrState from '../modules/util';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Image from 'next/image';
import { useState } from 'react';

export default function ExploreParkItem(props) {
  // const [visited, setVisited] = useState(false);
  let visited = false;

  // Set appropriate park link based on props
  const nationalPark = props.nationalPark;
  const visitedParks = props.visitedParks;
  let parkLink = "parks/" + nationalPark.id;

  // Convert state abbreviations into full names
  let statesList = nationalPark.states.split(',');
  statesList = statesList.map((state) => {
    return abbrState(state);
  });

  // Check whether the user has visited this park
  if(visitedParks){
    visited = visitedParks.some(visit => visit[0] === nationalPark.id);
  }

  return(
    <Link className='exploreParkLink' href={parkLink}>
      <Card style={{ border: visited? '1px solid #1B742E' : '' }}>
        <CardActionArea>
          {/* Main image of park */}
          <CardMedia
            component='img' // {Image}
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
              {nationalPark.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}
