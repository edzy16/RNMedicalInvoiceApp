import {StyleSheet, Text, SafeAreaView, useColorScheme} from 'react-native';
import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {postData} from '../../utils/Services';
import CustomSnackbar from '../../components/customSnackbar';
import LottieModal from '../../components/LottieModal';
import LottieView from 'lottie-react-native';

const Title = styled.Text`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Input = styled.TextInput`
  width: 100%;
  height: 50px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 12px;
`;

const Button = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background: #4a9ff5;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 500;
`;

const Login = () => {
  console.log('Login screen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState(false); // false for red, true for green
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation<any>();
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#222' : '#fff',
  };

  function handleLogin() {
    console.log('Login button pressed');
    // Add the code to make a POST request to the API
    // Use the postData function from utils/Services.ts
    // The endpoint is "login"
    // The data should be an object with email and password
    // If the request is successful, navigate to the Home screen
    // If the request fails, show a snackbar with the error message
    const data = {
      email: email,
      password: password,
    };
    setModalVisible(true);
    console.log(data);
    postData('user/login', data)
      .then(data => {
        console.log('POST request successful:', data);
        // Handle the response data dynamically
        if (data && data.status === '200') {
          setModalVisible(false);
          setVisible(true);
          setSnackbarMessage('Login successful');
          setSnackbarColor(true);
          console.log(data.message);
          // Navigate to the Home screen
          navigation.navigate('Home', {
            email: email,
            password: password,
            userId: data.data[0]?.userId,
            userName: data.data[0]?.fullName,
            userRole: data.data[0]?.role,
          });
        } else {
          setModalVisible(false);
          setVisible(true);
          setSnackbarMessage(data?.message || 'Login failed');
          setSnackbarColor(false);
          console.log(data?.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <LottieView
        autoPlay
        source={require('../../assets/prescription-lottie.json')}
        style={styles.icon}
      />
      <Title>Login</Title>
      <Input
        placeholder="Email / Mobile Number"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button onPress={() => handleLogin()}>
        <ButtonText>Sign In</ButtonText>
      </Button>
      <Text style={{margin: 20}}>
        Don't have an account?
        <ButtonText
          style={{color: 'blue'}}
          onPress={() => navigation.navigate('SignUp' as never)}>
          Sign up
        </ButtonText>
      </Text>

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

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    height: 50,
    width: 200,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});
