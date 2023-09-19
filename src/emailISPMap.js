//The map component. This one was fun figuring out.

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

mapboxgl.accessToken = process.env.REACT_APP_TOKEN;
const Token = process.env.REACT_APP_TOKEN;

//Before the Map function is called, a data formatter function is defined.
//This "converts" the data from SaaSAlerts into an object that MapboxGL can use as a source.
const prepareEventData = (data) => {
    let arr = [];
    let seenProperties = new Set();  // This tracks which properties have already been counted

    for (let i = 0; i < data.length; i++) {
        let properties = {
            'name': data[i]._source.user.fullName,
            'email': data[i]._source.user.name,
            'company': data[i]._source.customer.name
        };

        // Convert the properties to a string
        let propertiesString = JSON.stringify(properties);

        if (!seenProperties.has(propertiesString)) {
            let feature = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': data[i]._source.location.mapCoordinates
                },
                'properties': properties
            }
            arr.push(feature);

            // Add the properties string to the set
            seenProperties.add(propertiesString);
        }
    }
    return arr;
}


const Map = (props) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-96.13);
    const [lat, setLat] = useState(41.26);
    const [zoom, setZoom] = useState(4);

    useEffect(() => {
        let greenFeatures = prepareEventData(props.props.eventData); //greenFeatures was originally named after the greenDot.png used as a map point

        let userPoint = {
            'type': 'geojson',
            data: {
                'type': 'FeatureCollection',
                features: greenFeatures
            }
        };

        if (map.current) return; //prevents the map from being needlessly re-rendered 

        //initialize the map
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/jmar1/cllk336nu00io01r83l4e9vu4', //styles are created on the Mapbox website and linked
            center: [lng, lat],
            zoom: zoom
        });

        //This is the primary layer, loaded on-load. clusterMaxZoom and clusterRadius are global
        map.current.on('load', () => {
            map.current.addSource('points', {
                type: 'geojson',
                data: userPoint.data,
                cluster: true,
                clusterMaxZoom: 30,
                clusterRadius: 10
            });

            //Layers are added piecemeal. This layer primarily concerns the color and size of each cluster
            map.current.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'points',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        '#8ef562',
                        5,
                        '#8ef562',
                        10,
                        '#62f2f5'
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        15,
                        1,
                        15,
                        100,
                        15,
                        750,
                        15
                    ]
                }
            });

            //This layer concerns the cluster-count's numbering properties (font, text size, etc)
            map.current.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'points',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
                    'text-size': 18
                }
            });

            //This layer adds unclustered points (individual dots on the map)
            map.current.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'points',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': '#8ef562',
                    'circle-radius': 5
                }
            });

            //This onclick layer handles the information box when each cluster is clicked. Name, email, and company of each clustered point is seen
            map.current.on('click', 'clusters', (e) => {
                const features = map.current.queryRenderedFeatures(e.point, {
                    layers: ['clusters']
                });

                const clusterId = features[0].properties.cluster_id;
                map.current.getSource('points').getClusterLeaves(clusterId, 10, 0, (err, aFeatures) => {
                    if (err) {
                        throw err;
                    }

                    let descriptions = aFeatures.map(feature => {
                        return `<div style="line-height: 1.35vh; font-size:small; font-variant: small-caps">
                        <b>${feature.properties.name}</b><br>
                        ${feature.properties.email}<br>
                        ${feature.properties.company}
                        </div>`;
                    }).join('<hr>');

                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(descriptions)
                        .addTo(map.current);
                });
            });

            //Same thing here, but for individual points.
            map.current.on('click', 'unclustered-point', (e) => {
                const feature = e.features[0];  // Assuming only one feature is under the clicked point

                const description = `
                    <div style="line-height: 1.35vh; font-size:small; font-variant: small-caps">
                        <b>${feature.properties.name}</b><br>
                        ${feature.properties.email}<br>
                        ${feature.properties.company}
                    </div>
                `;

                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(description)
                    .addTo(map.current);
            });

        });
    });

    //return the map.
    if (!map) {
        return <p>LOADING</p>
    } else {
        return (
            <div>
                <div ref={mapContainer} className="map-container" />
            </div>
        );
    }
}

export { Map };
