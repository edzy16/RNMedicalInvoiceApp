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
import {Card, Icon} from '@rneui/themed';
import {CardImage} from '@rneui/base/dist/Card/Card.Image';
import InvoiceCard from './InvoiceCard';
import {ButtonGroup} from '@rneui/base';

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

  const handleInvoiceCardVisibility = (index: number, visibility: boolean) => {
    const newInvoiceCardVisible: any = [...invoiceCardVisible];
    newInvoiceCardVisible[index] = visibility;
    setInvoiceCardVisible(newInvoiceCardVisible);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getData('prescription/user/' + userId);
      console.log('result', result);

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
            <Card
              wrapperStyle={{
                backgroundColor: isDarkMode ? '#3f3f3f' : '#fcf6f0',
              }}
              containerStyle={{
                backgroundColor: isDarkMode ? '#3f3f3f' : '#fcf6f0',
                borderRadius: 10,
              }}
              key={item.prescriptionId}>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View>
                  <CardImage
                    source={{uri: item.imageUrl}}
                    style={{width: 350, height: 200}}
                    onError={error =>
                      console.error('Error loading image:', error)
                    }
                  />
                </View>
                <View>
                  {item.invoices !== null ? (
                    item.invoices.map((invoice: any, index: number) => (
                      <React.Fragment key={invoice.invoiceId}>
                        <PaperCard
                          style={{
                            height: 50,
                            width: 200,
                            margin: 10,
                            flex: 0,
                            justifyContent: 'center',
                          }}
                          onPress={() =>
                            handleInvoiceCardVisibility(index, true)
                          }>
                          <Text
                            style={{
                              textAlign: 'center',
                            }}>
                            Invoice {index + 1}
                          </Text>
                        </PaperCard>
                        {invoiceCardVisible[index] && (
                          <InvoiceCard
                            key={invoice.invoiceId} // Use a unique key for each InvoiceCard
                            invoice={invoice}
                            index={index}
                            onClose={() =>
                              handleInvoiceCardVisibility(index, false)
                            }
                            visible={invoiceCardVisible[index]}
                          />
                        )}
                      </React.Fragment>
                    ))
                  ) : userRole !== 'REP' ? (
                    <Card>
                      <Text>No invoices found</Text>
                    </Card>
                  ) : (
                    <PaperCard style={{margin: 10}}>
                      <Button>Generate Invoice</Button>
                    </PaperCard>
                  )}
                </View>
              </View>
            </Card>
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
      {userRole !== 'REP' && (
        <Button
          // icon="camera"
          mode="contained"
          onPress={() => handleCameraButtonClick()}
          style={[styles.button, {backgroundColor: MD3Colors.error70}]}>
          <Icon name="camera" />
        </Button>
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
