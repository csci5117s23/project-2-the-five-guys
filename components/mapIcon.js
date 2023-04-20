import Image from "next/image";

export default function MapIcon(props)
{
    const {parkInfo} = props;
    return (
        <>
            <div className="mapIcon">
                <div className="mapIconImageContainer">
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