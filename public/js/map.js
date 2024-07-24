console.log(id);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: id.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});


// console.log(id.location);
 const marker2 = new mapboxgl.Marker({ color: 'red'})
        .setLngLat(id.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({offset:25}).setHTML(
                `<h4>${id.location}</h4><p>Excact location after booking.</p>`
            )
        )
        .addTo(map);