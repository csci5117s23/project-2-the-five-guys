import { Accordion, AccordionDetails, AccordionSummary} from '@mui/material';
import Stack from '@mui/joy/Stack';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Carousel from 'react-material-ui-carousel';
import Skeleton from '@mui/material/Skeleton';
import abbrState from '../modules/util';

export default function NationalParkItem(props)
{
  const {nationalPark} = props;

  const ParkMap = dynamic(
    () => import('@/components/parkMap'),
    {
      loading: () => <Skeleton variant='rectangular' width={"100%"} height={"20rem"}/>,
      ssr: false // line prevents server-side render
    }
  )

  // Convert state abbreviations into full names
  let statesList = nationalPark.states.split(',');
  statesList = statesList.map((state) => {
    return abbrState(state);
  });

  return (
    <div className="nationalParkItemContainer">
      <div className="nationalParkItemContents">
        {/* Name of park and map of noteworthy locations */}
        <div className='parkName'> {nationalPark.fullName} </div>
        <div> <ParkMap park={nationalPark}/> </div>

        
        <Stack style={{fontSize:"1.3rem"}} spacing={2}>
          {/* Description of park from API */}
          <div className='parkAbout'> About: </div>
          <div style={{fontSize:"1rem"}}> {nationalPark.description} </div>
          <div style={{fontSize:"1.1rem"}}> Located in: {statesList.join(', ')} </div>

          {/* Link to official park page */}
          <div div style={{fontSize:"1.1rem"}}> <Link style={{color: "#1B742E"}} href={nationalPark.url}>Official Park Page</Link> </div>
        </Stack>

        <div>
          {/* Park images carousel */}
          <div className='parkItemImages'>
            <div className='imagesCarouselContainer'>
              <Carousel className='imagesCarousel' animation='slide' swipe navButtonsAlwaysVisible>
                {
                  nationalPark.images.map((image, index) => {
                    return(
                      <>
                        <div key={index}>
                          <img className="carouselImage" src={image.url} alt={image.title} />
                          <Stack direction="column">
                            <div style={{paddingLeft: "1rem", fontSize: "1.3rem"}}>{image.title}</div>
                            <div style={{paddingLeft: "1rem", fontSize: ".8rem"}}>{image.credit}</div>
                            {/* <div style={{paddingLeft: "1rem"}}>{image.description}</div> */}
                          </Stack>
                        </div>
                      </>
                    )
                  })
                }
              </Carousel>
            </div>
          </div>

          {/* List of park activities */}
          <div className='activitiesAccordion'>
            <Accordion style={{color: "green", border: "5px Solid #1B742E"}}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography fontSize={"1.3rem"}>Park Activities</Typography>
              </AccordionSummary>
              <AccordionDetails>
                  <Stack spacing={2}>
                    {nationalPark.activities.map((activity, index) => (
                      <Typography key={index} color={"black"} fontSize={".9rem"}>
                        {activity.name}
                      </Typography>
                    ))}
                  </Stack>
              </AccordionDetails>
            </Accordion>
          </div>

        </div>
      </div>
    </div>
  )
}