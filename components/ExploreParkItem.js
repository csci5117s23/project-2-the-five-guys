import Link from 'next/link';
import Grid from '@mui/material/Grid';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';

export default function ExploreParkItem(props) {
  const {nationalPark} = props;
  let parkLink = "parks/"+nationalPark.id;
  return(
    // <Link className='exploreParkLink' href={parkLink}>
    //   <Grid className="exploreParkItem" container spacing={2}>
    //     <Grid item xs={3}>
    //       <img className = "exploreParkPic" src={nationalPark.images[0].url}></img>
    //     </Grid>
    //     <Grid className='exploreParkName' item xs={9}>
    //       {nationalPark.name}
    //     </Grid>
    //   </Grid>
    // </Link>

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
            <Typography variant='body2' color='green'>
              {nationalPark.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}