import {Platform, Alert} from 'react-native';
import {
  CameraOptions,
  launchCamera,
  MediaType,
} from 'react-native-image-picker';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

export default async function takePhoto() {
  if (Platform.OS !== 'web') {
    const permission = await check(PERMISSIONS.ANDROID.CAMERA);

    if (permission !== RESULTS.GRANTED) {
      const newPermission = await request(PERMISSIONS.ANDROID.CAMERA);

      if (newPermission !== RESULTS.GRANTED) {
        Alert.alert('Sorry, we need camera permissions to make this work!');
        return;
      }
    }
  }

  const options = {
    mediaType: 'photo' as MediaType,
    quality: 0.5,
  } as CameraOptions;

  return new Promise((resolve, reject) => {
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        reject('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        reject('ImagePicker Error: ' + response.errorMessage);
      } else {
        const source = response.assets;
        console.log(source);
        resolve(source);
      }
    });
  });
}
