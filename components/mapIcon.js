import Image from "next/image";

export default function MapIcon(props)
{
    const parkInfo = props.parkInfo;
    const visitedParks = props.visitedParks;

    let visited = false;
    let isPastTrip = false;

    // Check whether the user has visited this park
    // If they have, check whether it is a past or upcoming trip
    if(visitedParks){
        const visit = visitedParks.find(visit => visit[0] === parkInfo.id);
        if(visit){
            visited = true;
            if(Date.now() > new Date(visit[2]).getTime()){
                isPastTrip = true;
            }
        }
    }

    // Styling for explore park item depending on past or upcoming visit
    const borderStyling={
        border: (visited && isPastTrip) ? '3px solid #1B742E' : 
                (visited && !isPastTrip) ? '3px solid gray' : ''
    };

    return (
        <>
            <div className="mapIcon">
                <div className="mapIconImageContainer" style={borderStyling}>
                    <Image 
                        className="mapIconImage" 
                        src={parkInfo.images[0].url}
                        alt="park photo"
                        width={53}
                        height={53}
                        crop="fill"
                        loading="lazy"
                    />
                </div>
            </div>
        </>
        
    )
}