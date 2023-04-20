export default function MapIcon(props)
{
    const {parkInfo} = props;
    return (
        <>
            <div className="mapIcon">
                <div className="mapIconImageContainer">
                    <img className="mapIconImage" src={parkInfo.images[0].url}></img>
                </div>
            </div>
        </>
        
    )
}