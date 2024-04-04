import { useRef, useEffect } from "react";
import "../styles/Map.css";

const placesService = { current: null };

function Map (props) {
    const mapContainerRef = useRef();
    const map = useRef();

    let placeId = props.placeId;

    /* Initialize map */
    useEffect(() => {
      map.current = new window.google.maps.Map(mapContainerRef.current, {
        mapId: "2222bbb20dcbec3c",
        center: { lat: 50, lng: 50 },
        zoom: 15,
        mapTypeControlOptions: {
          mapTypeIds: [],
        },
        streetViewControl: false,
      });

      /* Check if placesService is loaded and placeId is valid */
      if (!placesService.current && window.google) {
        placesService.current = new window.google.maps.places.PlacesService(map.current);
      }
      if (!placesService.current) {
        return undefined;
      }
      if (!placeId) {
        return undefined;
      }

      /* Get place details from placesService, center map and set marker */
      placesService.current.getDetails({ placeId: placeId }, (place, status) => {
        if (status === "OK") {
          map.current.setCenter({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()})
          new window.google.maps.marker.AdvancedMarkerElement({
            map: map.current,
            position: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
          });
        }
      });

    }, [placeId])

    return (
      <div>
        <div ref={mapContainerRef} className="map-container-div" />
      </div>
    );
}

export default Map;