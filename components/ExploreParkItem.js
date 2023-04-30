import Link from 'next/link';
import { Card, CardActionArea, CardContent, CardMedia, Tooltip, Typography } from '@mui/material';
import abbrState from '../modules/util';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Image from 'next/image';
import { useState } from 'react';

export default function ExploreParkItem(props) {
  let visited = false;
  let isPastTrip = false;

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
  // If they have, check whether it is a past or upcoming trip
  if(visitedParks){
    const visit = visitedParks.find(visit => visit[0] === nationalPark.id);
    if(visit){
      visited = true;
      if(Date.now() > new Date(visit[2]).getTime()){
        isPastTrip = true;
      }
    }
  }

  // Styling for explore park item depending on past or upcoming visit
  const borderStyling={
    border: (visited && isPastTrip) ? '1px solid #1B742E' : 
            (visited && !isPastTrip) ? '1px solid gray' : ''
  };

  return(
    <Link className='exploreParkLink' href={parkLink}>
      <Card style={borderStyling}>
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
                <>
                  {isPastTrip ? (
                    <Tooltip title='Past trip'>
                      <CheckCircleIcon color='primary' style={{ marginLeft: '5px' }} />
                    </Tooltip>
                  ) : (
                    <Tooltip title='Upcoming trip'>
                      <EventNoteIcon style={{ marginLeft: '5px', color: 'gray' }} />
                    </Tooltip>
                  )}
                </>
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
