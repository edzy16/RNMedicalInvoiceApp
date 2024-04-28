import {StyleSheet, Text, View, useColorScheme} from 'react-native';
import React, {useState} from 'react';
import {Card} from '@rneui/base';
import InvoiceCard from './InvoiceCard';
import {CardImage} from '@rneui/base/dist/Card/Card.Image';
import {
  Button,
  IconButton,
  MD3Colors,
  Card as PaperCard,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

type Props = {
  item: any;
  email: string;
  password: string;
  userId: string;
  userName: string;
  userRole: string;
};

const PrecriptionCard = ({
  item,
  email,
  password,
  userId,
  userName,
  userRole,
}: Props) => {
  const [invoiceCardVisible, setInvoiceCardVisible] = useState([]);

  const isDarkMode = useColorScheme() === 'dark';
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
  return (
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
            onError={error => console.error('Error loading image:', error)}
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
                  onPress={() => handleInvoiceCardVisibility(index, true)}>
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
                    onClose={() => handleInvoiceCardVisibility(index, false)}
                    visible={invoiceCardVisible[index]}
                    invoiceData={JSON.parse(invoice.invoiceJson)}
                  />
                )}
              </React.Fragment>
            ))
          ) : userRole !== 'REP' ? (
            <PaperCard
              style={{
                height: 50,
                width: 140,
                justifyContent: 'center',
                alignItems: 'center',
                margin: 10,
              }}>
              <Text>No invoices found</Text>
            </PaperCard>
          ) : (
            <PaperCard
              style={{margin: 10}}
              onPress={() => navi(item.prescriptionId)}>
              <Button>Generate Invoice</Button>
            </PaperCard>
          )}
        </View>
      </View>
    </Card>
  );
};

export default PrecriptionCard;

const styles = StyleSheet.create({});
