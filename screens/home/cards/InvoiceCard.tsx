import {View, Text, FlatList, Modal, StyleSheet} from 'react-native';
import React from 'react';
import {Card} from 'react-native-paper';
import {Button} from 'react-native-paper';
import {Icon} from '@rneui/base';
import {useColorScheme} from 'react-native';

type Props = {
  invoice: any;
  index: number;
  visible: boolean;
  onClose: () => void;
};

const InvoiceCard = ({invoice, index, visible, onClose}: Props) => {
  console.log('invoicecard', invoice);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
  };
  const colorStyle = {
    color: isDarkMode ? '#fff' : '#000',
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      onDismiss={onClose}
      style={{backgroundColor: 'blur'}}>
      <View style={[styles.container, backgroundStyle]}>
        <Card
          key={index}
          style={{height: 200, width: 380, padding: 10, margin: 10}}>
          <Button
            onPress={onClose}
            style={{height: 50, width: 50, position: 'absolute', left: 310}}>
            <Icon name="close" color={isDarkMode ? '#fff' : '#00000'} />
          </Button>
          <Text style={{marginTop: 30}}>Invoice no.:{invoice.invoiceNo}</Text>
          <FlatList
            data={JSON.parse(invoice.invoiceJson).medicines}
            keyExtractor={(medicine, idx) => idx.toString()}
            renderItem={({item: medicine}) => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text>{medicine.name}</Text>
                <Text>MRP: {medicine.mrp}</Text>
                <Text>Qty: {medicine.qty}</Text>
                <Text>Price: {medicine.price}</Text>
              </View>
            )}
          />
          <Text>Total Amount: {JSON.parse(invoice.invoiceJson).total_amt}</Text>
          <Text>GST: {JSON.parse(invoice.invoiceJson).gst}%</Text>
          <Text>
            Grand Total: {JSON.parse(invoice.invoiceJson).grand_total}
          </Text>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InvoiceCard;
