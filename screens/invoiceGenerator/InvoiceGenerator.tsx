import {StyleSheet, Text, View, useColorScheme} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getData} from '../../utils/Services';
import {Button, Card, Icon} from '@rneui/base';
import {Card as PaperCard} from 'react-native-paper';
import {ScrollView} from 'react-native';
import MedicineCard from './cards/MedicineCard';
import {useNavigation} from '@react-navigation/native';
type Props = {
  route: {
    params: {
      userId: string;
      userName: string;
    };
  };
};

const InvoiceGenerator = ({route}: Props) => {
  const {userId, userName} = route.params;
  const navigation = useNavigation<any>();

  console.log('InvoiceGenerator', userId, userName);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | Error>(null);
  const [data, setData] = useState<any[]>([]);
  const [medCardVisible, setMedCardVisible] = useState([]);
  const [medicinesData, setMedicinesData] = useState<any[]>([]);
  const [invoicesData, setInvoicesData] = useState<any[]>([]);
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleMedCardVisibility = (index: number, visible: boolean) => {
    console.log('in handleMedCardVisibility', index, visible);

    const newInvoiceCardVisible: any = [...medCardVisible];
    newInvoiceCardVisible[index] = visible;
    setMedCardVisible(newInvoiceCardVisible);
  };
  const getMedicineData = (props: any) => {
    const newMedicinesData: any[] = [...medicinesData];
    newMedicinesData.push({
      medicineId: props.medicine.medicineId,
      name: props.medicine.name,
      mrp: props.medicine.mrp,
      qty: props.requiredQuantity,
      price: props.medicine.mrp * props.requiredQuantity,
    });
    console.log('getMedicineData', newMedicinesData);
    setMedicinesData(newMedicinesData);
  };
  const handleInvoiceGeneration = () => {
    console.log('Generate Invoice');
    // setInvoicesData([{medicines: medicinesData}, total_amt: ]);
    navigation.goBack();
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
            flex: 0.8,
          }}>
          <Card.Title style={[colorStyle]}>Medicines</Card.Title>
          <ScrollView>
            {data.map((item, index) => (
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
              </PaperCard>
            ))}
          </ScrollView>
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
