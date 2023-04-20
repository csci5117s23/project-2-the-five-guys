import dynamic from 'next/dynamic';

export default function NationalParkItem(props)
{
    const {nationalPark} = props;

    const ParkMap = dynamic(
        () => import('@/components/parkMap'),
        {
          loading: () => <span>loading map....</span>,
          ssr: false // line prevents server-side render
        }
      )
    return (
        <div className="nationalParkItemContainer">
            <div>
                <ParkMap park={nationalPark}/>
            </div>
            <div className="nationalParkItemContents">
                <p className="parkDescription">{nationalPark.description}</p>
                <span>Things to do: </span>
                <ul className="activitiesList">
                    {nationalPark.activities.map((activity, index) => (
                        <li key={index}>{activity.name}</li>
                    ))}
                </ul>
            </div>
            
        </div>
    )
}