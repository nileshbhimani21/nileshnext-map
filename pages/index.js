import { Wrapper } from '@googlemaps/react-wrapper'
import Head from 'next/head'
import { useRef, useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

export const MyMapComponent = ({ zoom, Boy, Store }) => {
  const ref = useRef()
  const [map, setMap] = useState(null)

  function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    directionsService
      .route({
        origin: Boy,
        destination: Store,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response)
      })
      .catch((e) => window.alert(`Directions request failed due to ${e}`))
  }
  const [ratate, setRotate] = useState(0)
  useEffect(() => {
    const symbol = {  
      path: "M60 0L119.756 110.25L60 87L0.244247 110.25L60 0Z",
      fillColor: '#FF0000',
      fillOpacity: .5,
      anchor: new google.maps.Point(50, 50),
      strokeWeight: 0,
      scale: .5,
      rotation: ratate
  }
    const marker1 = new window.google.maps.Marker({
      position: new window.google.maps.LatLng(Boy),
      icon: symbol,
      map,
    })
    marker1.setValues({type: "point", id: "marker1"});
    
    const angle = google.maps.geometry?.spherical.computeHeading(Boy, Store);
    setRotate(angle + 45)

    const marker2 = new window.google.maps.Marker({
      position: new window.google.maps.LatLng(Store),
      icon: '/images/statusDelivery.svg',
      map,
    })
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center: Boy,
          zoom,

        })
      )
    }
    if (ref.current && map) {
      const directionsService = new google.maps.DirectionsService()
      const directionsRenderer = new google.maps.DirectionsRenderer()
      directionsRenderer.setOptions({
        polylineOptions: {
          strokeColor: '#191919',
        },
        suppressMarkers: true,
      })
      directionsRenderer.setMap(map)
      calculateAndDisplayRoute(directionsService, directionsRenderer)
    }
  }, [ref, map])

  return <div ref={ref} style={{ maxWidth: '400px', width: "100%", height: '400px' }} />
}

export default function Home() {
  const Store = {
    lat: 22.6940984,
    lng: 70.2986376,
  }
  const [Boy, setBoy] = useState({
    lat: 0,
    lng: 0,
  })
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setBoy({lat:latitude, lng:longitude})
        },

      )
    }
  })
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <script async src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAYRZi8r9KSX8TJ6lBlFvCSb5z93TXK8ho&libraries=places,geometry`} />
      </Head>
      <main className={styles.main}>
        <Wrapper apiKey="AIzaSyAYRZi8r9KSX8TJ6lBlFvCSb5z93TXK8ho">
          <MyMapComponent zoom={12} Boy={Boy} Store={Store} />
        </Wrapper>
      </main>
    </div>
  )
}
