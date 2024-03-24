import Geolocation, {
  getCurrentPosition,
} from 'react-native-geolocation-service';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

async function getCurrentLocation() {
  return new Promise(async (resolve, reject) => {
    const permission = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    if (permission === RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position.coords.latitude, position.coords.longitude);
          resolve(position);
        },
        error => {
          console.error(error);
          reject(error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } else if (permission === RESULTS.DENIED) {
      const newPermission = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );

      if (newPermission === RESULTS.GRANTED) {
        // Call getCurrentLocation() again
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            resolve(position);
          },
          error => {
            console.error(error);
            reject(error);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        console.log('Permission denied');
        reject('Permission denied');
      }
    }
  });
}

export default getCurrentLocation;
