import Link from 'next/link';

export default function ExploreParkItem(props) {
    const {nationalPark} = props;
    let parkLink = "parks/"+nationalPark.id;
    return(
    <Link href={parkLink}>
        <div key={nationalPark.name} className="pure-g exploreParkItem" id="explore">
          <div className="pure-u-1-4" id="parkPic">
            <img className = "exploreParkPic" src={nationalPark.images[0].url}></img>
          </div>

          <div className="pure-u-3-4" id="parkName">
            <h2 className='exploreParkName'>{nationalPark.name}</h2>
          </div>
        </div>
    </Link>
    );
}