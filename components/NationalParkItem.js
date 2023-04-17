export default function NationalParkItem(props)
{
    const {nationalPark} = props;
    return (
        <div className="nationalParkItemContainer">
            <div className="parkTitle">
                <span>{nationalPark.name}</span>
            </div>
            <div className="parkImage">
                <img src={nationalPark.images[0].url}></img>
            </div>
            <div className="nationalParkItemContents">
                <p className="parkDescription">{nationalPark.description}</p>
                <span>Things to do: </span>
                <ul className="activitiesList">
                    {nationalPark.activities.map(activity => (
                        <li>{activity.name}</li>
                    ))}
                </ul>
            </div>
            
        </div>
    )
}