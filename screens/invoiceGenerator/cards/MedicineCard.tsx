import {
  View,
  Text,
  FlatList,
  Modal,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import React, {useState} from 'react';
import {Card, TextInput} from 'react-native-paper';
import {Button} from 'react-native-paper';
import {Icon} from '@rneui/base';
import {Card as ElementsCard} from '@rneui/base';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import {postData} from '../../../utils/Services';
import CustomSnackbar from '../../../components/customSnackbar';

type Props = {
  index: number;
  visible: boolean;
  onClose: () => void;
  medicine: {
    medicineId: string;
    name: string;
    description?: string;
    mrp: number;
    quantity: number;
    sellingPrice: number;
  };
  getMedicineData: (props: any) => void;
};

const MedicineCard = ({
  index,
  visible,
  onClose,
  medicine,
  getMedicineData,
}: Props) => {
  const [quantity, setQuantity] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(medicine.mrp);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState(false); // false for red, true for green
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
  };
  const colorStyle = {
    color: isDarkMode ? '#fff' : '#000',
  };
  const handleAddToCart = () => {
    console.log('Add to cart', quantity);
    if (quantity === 0) {
      setSnackbarMessage('Please enter quantity');
      setSnackbarColor(false);
      setSnackbarVisible(true);
      return;
    } else if (quantity > medicine.quantity) {
      setSnackbarMessage('Quantity not available');
      setSnackbarColor(false);
      setSnackbarVisible(true);
      return;
    } else if (sellingPrice > medicine.mrp && sellingPrice < 0) {
      setSnackbarMessage('Selling price should be less than MRP');
      setSnackbarColor(false);
      setSnackbarVisible(true);
      return;
    }

    getMedicineData({medicine, requiredQuantity: quantity, sellingPrice});
    onClose();
  };
  const updateStock = () => {
    console.log('Update stock', medicine, quantity);
    postData('medicines/update', {
      medicineId: medicine.medicineId,
      quantity: quantity,
      name: medicine.name,
      description: medicine.description,
      mrp: medicine.mrp,
      sellingPrice: medicine.sellingPrice,
    });
    onClose();
  };
  if (sellingPrice.toString()) {
    console.log('sellingPrice', sellingPrice);
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      onDismiss={onClose}
      style={{backgroundColor: 'blur'}}>
      <View style={[styles.container, backgroundStyle]}>
        <Card key={index} style={styles.modalContent}>
          <Button
            onPress={onClose}
            style={{
              height: 50,
              width: 50,
              position: 'absolute',
              left: 310,
              zIndex: 1,
            }}>
            <Icon name="close" color={isDarkMode ? '#fff' : '#00000'} />
          </Button>
          <ElementsCard.Title style={[colorStyle]}>
            {medicine.name}
          </ElementsCard.Title>
          <ElementsCard.Divider />
          <FlatList
            data={[medicine]}
            renderItem={({item: medicine}) => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text>MRP: {medicine.mrp}</Text>
                <Text>Available quantity: {medicine.quantity}</Text>
                <Text>Price: {medicine.sellingPrice}</Text>
              </View>
            )}
          />
          <TextInput
            label="Quantity"
            keyboardType="numeric"
            style={{margin: 10}}
            // value={quantity.toString()}
            onChangeText={text => setQuantity(parseInt(text, 10))}
          />
          <TextInput
            label="Selling Price"
            keyboardType="numeric"
            style={{margin: 10}}
            value={
              sellingPrice.toString() != 'NaN' ? sellingPrice.toString() : '0'
            }
            onChangeText={text => setSellingPrice(parseInt(text, 10))}
          />
          <Button
            mode="contained"
            style={{margin: 10}}
            onPress={handleAddToCart}>
            <Icon name="shopping-cart" />
            <Text>Add to cart</Text>
          </Button>
          <CustomSnackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            message={snackbarMessage}
            snackbarColor={snackbarColor}
          />
        </Card>
      </View>
    </Modal>
  );
};

export default MedicineCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    height: 350,
    width: 380,
    padding: 10,
    margin: 10,
  },
});
