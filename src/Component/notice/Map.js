import L from 'leaflet';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import {useEffect, useState} from "react";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import axios from 'axios';
import React from "react";
import { useLocation } from 'react-router-dom';
import {isEmptyResponse} from "../../Utils";

const MapComponent = () => {

    const [namedEntities, setEntities] = useState([]);
    const articleUri = new URLSearchParams(useLocation().search).get("uri");

    // This is needed to diplay an icon for each point on the map
    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    /**
     * Retrieve the geographical named entities of the article abstract from the backend
     */
    useEffect(() => {
        let query = process.env.REACT_APP_BACKEND_URL + "/getGeographicNamedEntities/?uri=" + articleUri;
        axios(query).then(response => {
            if (!isEmptyResponse(query, response)) {
                let entities = response.data.result;
                if (process.env.REACT_APP_LOG === "on") {
                    console.log("------------------------- Retrieved " + entities.length + " results for geographical entities.");
                    entities.forEach(e => console.log(e));
                }
                setEntities(entities);
            }
        })
        //eslint-disable-next-line
    }, []);


    /**
     *
     * @param props
     * @returns {JSX.Element|null}
     * @constructor
     */
    function Point2(props) {
        const marker = props.entity
        return marker !== undefined ?
            <Marker position={[marker.latitude, marker.longitude]}>
                <Popup>
                    <h3>{marker.name}</h3>
                    <div><span className="font-weight-bold">Latitude</span>: {marker.latitude}</div>
                    <div><span className="font-weight-bold">Longitude</span> : {marker.longitude}</div>
                    {marker.altitude !== undefined ?
                        <div><span className="font-weight-bold">Altitude</span> : {marker.altitude}</div> : null}
                    {marker.alternateNames !== "" ?
                        <div><span className="font-weight-bold">Alternative names</span>: {marker.alternateNames} </div> : null}
                    {marker.nameParentCountry !== undefined ?
                        <div><span className="font-weight-bold">Country</span>: {marker.nameParentCountry}</div> : null}
                    <div><a href={marker.entityUri}
                            target="_blank" rel="noreferrer">GeoNames</a></div>
                </Popup>
            </Marker> : null;
    }

    let result = [];
    for (let ne of namedEntities) {
        result.push(<Point2 key={"key_" + ne.name + ne.latitude + ne.longitude} entity={ne} />)
    }

    return (
        <div className="component">
            <div className="content_header">Geographic named enties extracted from the text</div>
            <MapContainer center={[30, 2]} zoom={2} scrollWheelZoom={true} style={{height: '400px'}}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
                />
                { result }
            </MapContainer>
        </div>
    );
};

export default MapComponent;
