import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './screens/loginSignup/Login';
import SignUp from './screens/loginSignup/SignUp';
import Home from './screens/home/Home';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import InvoiceGenerator from './screens/invoiceGenerator/InvoiceGenerator';

type StackProps = {
  Login: undefined;
  SignUp: undefined;
  Home: {
    email: string;
    password: string;
    userId: string;
    userName: string;
    userRole: string;
  };
  InvoiceGenerator: {userId: string; userName: string};
};

function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator<StackProps>();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
            initialParams={{
              email: '',
              password: '',
              userId: '',
              userName: '',
              userRole: '',
            }}
          />
          <Stack.Screen
            name="InvoiceGenerator"
            component={InvoiceGenerator}
            options={{headerShown: false}}
            initialParams={{userId: '', userName: ''}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
