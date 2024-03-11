import Geolocation from 'react-native-geolocation-service';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

async function getCurrentLocation() {
  const permission = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

  if (permission === RESULTS.GRANTED) {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
      },
      error => {
        console.error(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  } else if (permission === RESULTS.DENIED) {
    const newPermission = await request(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );

    if (newPermission === RESULTS.GRANTED) {
      // Call getCurrentLocation() again
    } else {
      console.log('Permission denied');
    }
  }
}

export default getCurrentLocation;
