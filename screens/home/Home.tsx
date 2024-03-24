import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import React, {useState} from 'react';
import {Button, IconButton, MD3Colors} from 'react-native-paper';
import takePhoto from '../../utils/OpenCamera';
import getCurrentLocation from '../../utils/CurrentLocation';
import CustomSnackbar from '../../components/customSnackbar';
import LottieModal from '../../components/LottieModal';
import {postMultipartData} from '../../utils/Services';

type Props = {
  route: {
    params: {
      email: string;
      password: string;
      userId: string;
      userName: string;
      userRole: string;
    };
  };
};

const Home = ({route}: Props) => {
  const {email, password, userId, userName, userRole} = route.params;
  console.log('In Home =', email, password, userId, userName, userRole);
  const [currentLocation, setCurrentLocation] = useState<any>();
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState(false); // false for red, true for green
  const [modalVisible, setModalVisible] = useState(false);

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#222' : '#fff',
  };

  function callSubmitApi(data: any) {
    console.log('In callSubmitApi');

    postMultipartData(data[0], data[1], data[2], data[3])
      .then(data => {
        console.log('POST request successful:', data);
        if (data.status === '200') {
          setModalVisible(false);
          setVisible(true);
          setSnackbarMessage(data.message);
          setSnackbarColor(true);
          console.log(data.message);
        } else {
          setModalVisible(false);
          setVisible(true);
          setSnackbarMessage(data.message);
          setSnackbarColor(false);
          console.log(data.message);
        }
      })
      .catch(error => {
        setModalVisible(false);
        setVisible(true);
        setSnackbarMessage('Error uploading image');
        setSnackbarColor(false);
        console.error('Error:', error);
      });
  }

  async function handleCameraButtonClick() {
    console.log('Camera button clicked');
    try {
      const openCamera: any = await takePhoto();
      console.log('openCamera', openCamera);

      if (openCamera) {
        const location = await getCurrentLocation();
        if (location) {
          setModalVisible(true);
          setCurrentLocation(location);
          setVisible(true);
          setSnackbarMessage('Location is fetched');
          setSnackbarColor(true);
          console.log(location);
          const data = [
            'prescription/insert',
            openCamera[0].uri, // Access the uri property of the first element in the openCamera array
            userId,
            currentLocation,
          ];
          callSubmitApi(data);
        } else {
          setVisible(true);
          setSnackbarMessage('Error fetching location');
          setSnackbarColor(false);
          console.log('Error fetching location');
        }
        // Use the postMultipartData function from utils/Services.ts
        // The endpoint is "prescription/insert"
        // The data should be an object with imageUri, imageName, userId, and currentLocation
        // If the request is successful, show a snackbar with the success message
        // If the request fails, show a snackbar with the error message
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <Text>Home</Text>
      <IconButton
        icon="camera"
        iconColor={MD3Colors.error70}
        size={50}
        onPress={() => handleCameraButtonClick()}
        style={[styles.button, {backgroundColor: isDarkMode ? '#fff' : '#222'}]}
      />
      {modalVisible && (
        <LottieModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          path={require('../../assets/uploading-lottie.json')}
        />
      )}
      <CustomSnackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        message={snackbarMessage}
        snackbarColor={snackbarColor}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Adjust for status bar height on Android
    position: 'relative',
  },
  button: {
    position: 'absolute',
    bottom: 35,
    right: 25,
  },
});
