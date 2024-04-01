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

type Props = {
  index: number;
  visible: boolean;
  onClose: () => void;
  medicine: {
    medicineId: string;
    name: string;
    mrp: number;
    quantity: number;
    sellingPrice: number;
  };
};

const MedicineCard = ({index, visible, onClose, medicine}: Props) => {
  console.log('in medicines card', medicine);
  const [quantity, setQuantity] = useState(0);

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
  };
  const colorStyle = {
    color: isDarkMode ? '#fff' : '#000',
  };
  const handleAddToCart = () => {
    console.log('Add to cart', quantity);
    onClose();
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
          <Button
            mode="contained"
            style={{margin: 10}}
            onPress={handleAddToCart}>
            <Icon name="shopping-cart" />
            <Text>Add to cart</Text>
          </Button>
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
    height: 250,
    width: 380,
    padding: 10,
    margin: 10,
  },
});
