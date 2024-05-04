import {Alert, StyleSheet, Text, View, useColorScheme} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getData, postData} from '../../utils/Services';
import {Button, Card, Icon} from '@rneui/base';
import {Card as PaperCard} from 'react-native-paper';
import {ScrollView} from 'react-native';
import MedicineCard from './cards/MedicineCard';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {styles as homeStyles} from '../home/Home';
import {FAB} from '@rneui/themed';
import MedUpdateCard from './cards/MedUpdateCard';
type Props = {
  route: {
    params: {
      userId: string;
      userName: string;
      prescriptionId?: string;
      email: string;
      password: string;
      userRole: string;
    };
  };
};

const InvoiceGenerator = ({route}: Props) => {
  const {userId, userName, prescriptionId, email, password, userRole} =
    route.params;
  const navigation = useNavigation<any>();

  console.log('InvoiceGenerator', userId, userName, prescriptionId);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | Error>(null);
  const [data, setData] = useState<any[]>([]);
  const [medCardVisible, setMedCardVisible] = useState([]);
  const [medicinesData, setMedicinesData] = useState<any[]>([]);
  const [medicineUpdate, setMedicineUpdate] = useState<any[]>([]);
  const [addMedicine, setAddMedicine] = useState<boolean>(false);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#222' : '#fff',
  };
  const colorStyle = {
    color: isDarkMode ? '#fff' : '#000',
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getData('medicines/' + userId);
      console.log('result', result);

      setData(result.medicines);
    } catch (error: any) {
      setError(error);
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('useFocusEffect');

      fetchData();
      return () => {
        // optional cleanup function
        setMedicinesData([]);
      };
    }, []),
  );
  useEffect(() => {
    fetchData();
  }, [medCardVisible, medicineUpdate]);
  const handleMedCardVisibility = (index: number, visible: boolean) => {
    console.log('in handleMedCardVisibility', index, visible);
    if (prescriptionId) {
      const newInvoiceCardVisible: any = [...medCardVisible];
      newInvoiceCardVisible[index] = visible;
      setMedCardVisible(newInvoiceCardVisible);
    } else {
      const newMedicineUpdate: any = [...medicineUpdate];
      newMedicineUpdate[index] = visible;
      setMedicineUpdate(newMedicineUpdate);
    }
  };
  const getMedicineData = (props: any) => {
    const newMedicinesData: any[] = [...medicinesData];
    newMedicinesData.push({
      medicineId: props.medicine.medicineId,
      name: props.medicine.name,
      mrp: props.medicine.mrp,
      qty: props.requiredQuantity,
      sellingPrice: props.sellingPrice,
      price: props.sellingPrice * props.requiredQuantity,
    });
    console.log('getMedicineData', newMedicinesData);
    setMedicinesData(newMedicinesData);
  };
  const handleInvoiceGeneration = () => {
    const invoiceData = {
      medicines: medicinesData,
      total_amt: medicinesData.reduce((acc, item) => acc + item.price, 0),
      gst: 5,
      grand_total:
        medicinesData.reduce((acc, item) => acc + item.price, 0) * 1.05,
    };
    console.log('Generate Invoice', invoiceData, userId, prescriptionId);
    const result = {
      invoiceJson: JSON.stringify(invoiceData),
      userId: userId,
      prescriptionId: prescriptionId,
    };

    postData('prescription/invoice/save', result).then(response => {
      console.log('response', response);
      if (response.status === '200') {
        navigation.navigate('Home', {
          userName: userName,
          userId: userId,
          email: email,
          password: password,
          userRole: userRole,
        });
      } else {
        Alert.alert('Error in generating invoice');
      }
    });
    // setInvoicesData([{medicines: medicinesData}, total_amt: ]);
    // navigation.goBack();
  };
  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error.message}</Text>
      ) : (
        <Card
          wrapperStyle={{
            backgroundColor: isDarkMode ? '#3f3f3f' : '#fcf6f0',
          }}
          containerStyle={{
            backgroundColor: isDarkMode ? '#3f3f3f' : '#fcf6f0',
            borderRadius: 10,
            flex: 1,
          }}>
          <Card.Title style={[colorStyle]}>Medicines</Card.Title>
          <ScrollView>
            {data?.map((item, index) => (
              <PaperCard
                key={index}
                style={styles.medicineCard}
                onPress={() => handleMedCardVisibility(index, true)}>
                <Text key={index}>{item.name}</Text>
                {medCardVisible[index] && (
                  <MedicineCard
                    index={index}
                    visible={medCardVisible[index]}
                    onClose={() => handleMedCardVisibility(index, false)}
                    medicine={item}
                    getMedicineData={getMedicineData}
                  />
                )}
                {medicineUpdate[index] && (
                  <MedUpdateCard
                    index={index}
                    visible={medCardVisible[index]}
                    onClose={() => handleMedCardVisibility(index, false)}
                    medicine={item}
                    userId={userId}
                  />
                )}
              </PaperCard>
            ))}
          </ScrollView>
          {prescriptionId ? (
            <Button onPress={() => handleInvoiceGeneration()}>
              <Icon
                name="receipt" // Name of the icon (e.g., 'list', 'receipt', etc.)
                type="material" // Type of the icon library (e.g., 'material', 'font-awesome')
                color="#000" // Color of the icon
                size={30} // Size of the icon
                // onPress={() => {
                //   // Handle onPress event if needed
                // }}
              />
              Generate Invoice
            </Button>
          ) : (
            <FAB
              // loading
              // visible={visible}
              icon={{name: 'add', color: 'white'}}
              size="small"
              // containerStyle={homeStyles.button}
              onPress={() => setAddMedicine(true)}
            />
          )}
          {addMedicine && (
            <MedUpdateCard
              visible={addMedicine}
              onClose={() => setAddMedicine(false)}
              userId={userId}
            />
          )}
        </Card>
      )}
    </SafeAreaView>
  );
};

export default InvoiceGenerator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  medicineCard: {
    borderRadius: 10,
    height: 50,
    width: 320,
    margin: 10,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
