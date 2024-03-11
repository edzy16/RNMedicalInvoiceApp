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

  launchCamera(options, response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
      return;
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
      return;
    } else {
      const source = {uri: response.assets};
      console.log(source);
      return source;
    }
  });
}
