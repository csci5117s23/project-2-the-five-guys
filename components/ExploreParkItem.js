import Link from 'next/link';
import Grid from '@mui/material/Grid';

export default function ExploreParkItem(props) {
    const {nationalPark} = props;
    let parkLink = "parks/"+nationalPark.id;
    return(
    <Link href={parkLink}>
      <Grid className="exploreParkItem" container spacing={2}>
        <Grid item xs={3}>
          <img className = "exploreParkPic" src={nationalPark.images[0].url}></img>
        </Grid>
        <Grid className='exploreParkName' item xs={9}>
          {nationalPark.name}
        </Grid>
      </Grid>
    </Link>
    );
}