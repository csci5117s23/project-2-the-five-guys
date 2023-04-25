import Link from 'next/link';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';

export default function ExploreParkItem(props) {
  // Set appropriate park link based on props
  const {nationalPark} = props;
  let parkLink = "parks/" + nationalPark.id;

  if(nationalPark.name === 'Acadia'){
    console.log(nationalPark);
  }

  return(
    <Link className='exploreParkLink' href={parkLink}>
      <Card>
        <CardActionArea>
          <CardMedia
            component='img'
            height='140'
            image={nationalPark.images[0].url}
            alt={nationalPark.name}
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='div' noWrap>
              {nationalPark.name}
            </Typography>
            <Typography variant='body2' color='#1B742E'>
              {nationalPark.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}