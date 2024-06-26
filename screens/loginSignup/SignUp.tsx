import {Picker} from '@react-native-picker/picker';
import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  useColorScheme,
} from 'react-native';
import CustomSnackbar from '../../components/customSnackbar';
import getCurrentLocation from '../../utils/CurrentLocation';
import {postData} from '../../utils/Services';
import {useNavigation} from '@react-navigation/native';
import LottieModal from '../../components/LottieModal';

const SignUp = () => {
  const navigation = useNavigation<any>();

  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [snackbarColor, setSnackbarColor] = useState(false); // false for red, true for green
  const [modalVisible, setModalVisible] = useState(false);

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#222' : '#fff',
  };

  const callSubmitApi = () => {
    console.log('callSubmitApi');

    const data = {
      email: email,
      password: password,
      fullName: name,
      role: role,
      currentLocation: currentLocation
        ? currentLocation.coords.latitude +
          ',' +
          currentLocation.coords.longitude
        : null,
      shopName: shopName ? shopName : null,
      phoneNo: mobile,
    };
    console.log(data);

    postData('user/register', data)
      .then(data => {
        setModalVisible(false);
        console.log('POST request successful:', data);
        // Handle the response data dynamically
        if (data.status === 'success') {
          setVisible(true);
          setSnackbarMessage(data.message);
          setSnackbarColor(true);
          console.log(data.message);
          // Navigate to the login screen
          navigation.navigate('Login', {email: email, password: password});
        } else {
          setVisible(true);
          setSnackbarMessage(data.message);
          setSnackbarColor(false);
          console.log(data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle errors
        setModalVisible(false);
      })
      .finally(() => setModalVisible(false));
  };

  const handleSignUp = () => {
    // Display the error message from the api using snackbar
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,4}){1}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (
      name.trim().length === 0 ||
      password.trim().length === 0 ||
      email.trim().length === 0 ||
      role.trim().length === 0 ||
      mobile.trim().length === 0
    ) {
      setVisible(true);
      setSnackbarMessage('Please fill all the fields');
      setSnackbarColor(false);
      console.log('Please fill all the fields');
      return;
    } else if (password !== confirmPassword) {
      setVisible(true);
      setSnackbarMessage('Passwords are not the same');
      setSnackbarColor(false);
      console.log('Passwords are not the same');
      return;
    } else if (mobile.length !== 10) {
      setVisible(true);
      setSnackbarMessage('Mobile number must be 10 digits');
      setSnackbarColor(false);
      console.log('Mobile number must be 10 digits');
      return;
    } else if (role === 'REP' && !shopName) {
      setVisible(true);
      setSnackbarMessage('Please enter the shop name');
      setSnackbarColor(false);
      console.log('Please enter the shop name');
      return;
    } else if (role === 'REP' && !currentLocation) {
      setVisible(true);
      setSnackbarMessage('Please get the current location');
      setSnackbarColor(false);
      console.log('Please get the current location');
      return;
    } else if (!emailRegex.test(email)) {
      setVisible(true);
      setSnackbarMessage('Please enter a valid email');
      setSnackbarColor(false);
      console.log('Please enter a valid email');
      return;
    } else if (!passwordRegex.test(password)) {
      setVisible(true);
      setSnackbarMessage(
        'Password must contain at least 8 characters, including letters and numbers',
      );
      setSnackbarColor(false);
      console.log(
        'Password must contain at least 8 characters, including letters and numbers',
        password,
      );
      return;
    }
    console.log(
      'All fields are correct, ready to send the request to the server',
    );
    setModalVisible(true);
    callSubmitApi();
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <Text style={styles.title}>Sign Up</Text>
      <Picker
        style={styles.input}
        selectedValue={role}
        placeholder="select a role"
        onValueChange={itemValue => setRole(itemValue)}>
        <Picker.Item label="Select a role" value="" />
        <Picker.Item label="Customer" value="USER" />
        <Picker.Item label="Medical Rep" value="REP" />
      </Picker>
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Full Name"
        keyboardType="default"
      />
      {role === 'REP' && (
        <TextInput
          style={styles.input}
          onChangeText={setShopName}
          value={shopName}
          placeholder="Shop Name"
          keyboardType="default"
        />
      )}
      <TextInput
        style={styles.input}
        onChangeText={setMobile}
        value={mobile}
        placeholder="Mobile"
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        placeholder="Confirm Password"
        secureTextEntry
      />

      {role === 'REP' && (
        <View style={{paddingBottom: 16}}>
          <Text style={{color: 'red'}}>
            Make sure you are in your medical shop to give the correct current
            location
          </Text>
          <Button
            title="📍Get Current Location"
            onPress={async () => {
              const location = await getCurrentLocation();
              if (location) {
                setCurrentLocation(location);
                setVisible(true);
                setSnackbarMessage('Location is fetched');
                setSnackbarColor(true);
                console.log(location);
              } else {
                setVisible(true);
                setSnackbarMessage('Error fetching location');
                setSnackbarColor(false);
                console.log('Error fetching location');
              }
            }}
            color="#007AFF"
          />
        </View>
      )}
      <Button title="Register" onPress={handleSignUp} />
      {modalVisible && (
        <LottieModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          path={require('../../assets/login-loading.json')}
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

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
});
