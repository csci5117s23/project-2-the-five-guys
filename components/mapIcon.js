export default function MapIcon(props)
{
    const {parkName} = props;
    return (
        <>
            <div className="mapIcon">
                <p >{parkName}</p>
            </div>
        </>
    )
}