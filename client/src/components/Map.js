import { useRef, useEffect, useState, useMemo} from "react";

const placesService = { current: null };

function Map (props) {
    const mapContainerRef = useRef();
    const [mapCenter, setMapCenter] = useState({ lat: 50, lng: 50 });
    const map = useRef();

    const renderMap = useMemo(() => {
      return <div ref={mapContainerRef} style={{ height: "35vh", width: "100%"}} />
    }, [mapCenter]);

    let placeId = props.placeId;

    useEffect(() => {
      map.current = new window.google.maps.Map(mapContainerRef.current, {
        mapId: "2222bbb20dcbec3c",
        center: mapCenter,
        zoom: 15,
        mapTypeControlOptions: {
          mapTypeIds: [],
        },
        streetViewControl: false,
      });
      if (!placesService.current && window.google) {
        placesService.current = new window.google.maps.places.PlacesService(map.current);
      }
      if (!placesService.current) {
        return undefined;
      }
      if (!placeId) {
        return undefined;
      }

      placesService.current.getDetails({ placeId: placeId }, (place, status) => {
        if (status === "OK") {
          map.current.setCenter({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()})
          // setMapCenter({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()});
          new window.google.maps.Marker({
            position: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
            map: map.current,
          });
        }
      });

    }, [])

    return (
      <div>
        {renderMap}
      </div>
    );
}

export default Map;