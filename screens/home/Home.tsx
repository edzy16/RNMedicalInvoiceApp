import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Button,
  IconButton,
  MD3Colors,
  Card as PaperCard,
} from 'react-native-paper';
import takePhoto from '../../utils/OpenCamera';
import getCurrentLocation from '../../utils/CurrentLocation';
import CustomSnackbar from '../../components/customSnackbar';
import LottieModal from '../../components/LottieModal';
import {getData, postMultipartData} from '../../utils/Services';
import {Card, FAB, Icon} from '@rneui/themed';
import {CardImage} from '@rneui/base/dist/Card/Card.Image';
import InvoiceCard from './cards/InvoiceCard';
import {ButtonGroup} from '@rneui/base';
import {useNavigation} from '@react-navigation/native';
import PrecriptionCard from './cards/PrecriptionCard';

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

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | Error>(null);
  const [data, setData] = useState<any[]>([]);
  const [invoiceCardVisible, setInvoiceCardVisible] = useState([]);

  const navigation = useNavigation<any>();
  const navi = (prescriptionId: string) => {
    console.log('In navi', prescriptionId);

    navigation.navigate('InvoiceGenerator', {
      userId: userId,
      userName: userName,
      prescriptionId: prescriptionId,
      email: email,
      password: password,
      userRole: userRole,
    });
  };

  const handleInvoiceCardVisibility = (index: number, visibility: boolean) => {
    const newInvoiceCardVisible: any = [...invoiceCardVisible];
    newInvoiceCardVisible[index] = visibility;
    setInvoiceCardVisible(newInvoiceCardVisible);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getData('prescription/user/' + userId);
      console.log(
        'result in home',
        JSON.stringify(result.prescriptions[1].invoices),
      );

      setData(result.prescriptions);
    } catch (error: any) {
      setError(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  function callSubmitApi(data: any) {
    console.log('In callSubmitApi', data);

    postMultipartData(data[0], data[1], data[2], data[3])
      .then(data => {
        console.log('POST request successful:', data);
        if (data.status === '200') {
          setModalVisible(false);
          setVisible(true);
          setSnackbarMessage(data.message);
          setSnackbarColor(true);
          console.log(data.message);
          fetchData();
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
      } else {
        setVisible(true);
        setSnackbarMessage('Error taking photo');
        setSnackbarColor(false);
        console.log('Error taking photo');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <Text>Welcome {userName}</Text>
      <ScrollView>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>Error: {error.message}</Text>
        ) : data ? (
          data.map((item: any, index: number) => (
            <PrecriptionCard
              key={item.prescriptionId}
              item={item}
              userId={userId}
              userName={userName}
              userRole={userRole}
              email={email}
              password={password}
            />
          ))
        ) : null}
      </ScrollView>
      {/* <IconButton
        icon="camera"
        iconColor={MD3Colors.error70}
        size={50}
        onPress={() => handleCameraButtonClick()}
        style={[styles.button, {backgroundColor: isDarkMode ? '#fff' : '#222'}]}
      /> */}
      {userRole !== 'REP' ? (
        <Button
          // icon="camera"
          mode="contained"
          onPress={() => handleCameraButtonClick()}
          style={[styles.button, {backgroundColor: MD3Colors.error70}]}>
          <Icon name="camera" />
        </Button>
      ) : (
        userRole === 'REP' && (
          <FAB
            // loading
            // visible={visible}
            icon={{name: 'add', color: 'white'}}
            size="small"
            // onPress={}
          />
        )
      )}

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
