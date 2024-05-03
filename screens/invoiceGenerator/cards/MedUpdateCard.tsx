import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import React, {useState} from 'react';
import {Button, Card, TextInput} from 'react-native-paper';
import {Icon} from '@rneui/base';
import {Card as ElementsCard} from '@rneui/themed';
import CustomSnackbar from '../../../components/customSnackbar';
import LottieModal from '../../../components/LottieModal';
import {postData, putData} from '../../../utils/Services';

type Props = {
  index: number;
  visible: boolean;
  onClose: () => void;
  medicine?: any;
  userId: string;
};

const MedUpdateCard = ({index, visible, onClose, medicine, userId}: Props) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
  };
  const colorStyle = {
    color: isDarkMode ? '#fff' : '#000',
  };
  console.log('MedUpdateCard', medicine, userId);

  type MedicineDetails = {
    medicineId: string;
    name: string;
    description: string;
    mrp: string;
    quantity: string;
    sellingPrice: string;
  };

  const [medicineDetails, setMedicineDetails] = useState<MedicineDetails>({
    medicineId: medicine.medicineId,
    name: medicine.name,
    description: medicine.description,
    mrp: medicine.mrp.toString(),
    quantity: medicine.quantity.toString(),
    sellingPrice: medicine.sellingPrice.toString(),
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState(false); // false for red, true for green
  const [modalVisible, setModalVisible] = useState(false);

  function renderTextField(label: string, type: keyof MedicineDetails) {
    return (
      <TextInput
        label={label}
        style={{margin: 10}}
        value={medicineDetails[type]}
        onChangeText={text =>
          setMedicineDetails({...medicineDetails, [type]: text})
        }
      />
    );
  }
  function onConfirm() {
    console.log('onConfirm');
    if (
      medicineDetails.name === '' ||
      medicineDetails.mrp === '' ||
      medicineDetails.sellingPrice === '' ||
      medicineDetails.quantity === '' ||
      medicineDetails.description === ''
    ) {
      console.log('Please fill all the fields');
      setSnackbarVisible(true);
      setSnackbarMessage('Please fill all the fields');
      return;
    } else if (medicineDetails.medicineId !== '') {
      console.log('Updating medicine');
      setModalVisible(true);
      const body = {
        userId: userId,
        medicineId: medicineDetails.medicineId,
        name: medicineDetails.name,
        description: medicineDetails.description,
        mrp: Number(medicineDetails.mrp),
        quantity: Number(medicineDetails.quantity),
        sellingPrice: Number(medicineDetails.sellingPrice),
      };
      console.log('Updating medicine', body);
      putData('medicines/update', body)
        .then(data => {
          console.log('POST request successful:', data);
          setModalVisible(false);
          if (data.status === '200') {
            setSnackbarVisible(true);
            setSnackbarMessage(data.message);
            setSnackbarColor(true);
            onClose();
          } else {
            setSnackbarVisible(true);
            setSnackbarMessage(data.message);
            setSnackbarColor(false);
          }
        })
        .catch(error => {
          setModalVisible(false);
          setSnackbarVisible(true);
          setSnackbarMessage('Error updating medicine');
          setSnackbarColor(false);
          console.error('Error:', error);
        })
        .finally(() => setModalVisible(false));
    } else {
      console.log('Adding new medicine');
      setModalVisible(true);
    }
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
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                {renderTextField('Name', 'name')}
                {renderTextField('Description', 'description')}
                {renderTextField('MRP', 'mrp')}
                {renderTextField('Quantity', 'quantity')}
                {renderTextField('Selling price', 'sellingPrice')}
              </View>
            )}
          />
          <Button
            mode="contained"
            style={{margin: 10}}
            onPress={() => onConfirm()}>
            {/* <Icon name="shopping-cart" /> */}
            <Text>Confirm</Text>
          </Button>
          <CustomSnackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            message={snackbarMessage}
            snackbarColor={snackbarColor}
          />
          {modalVisible && (
            <LottieModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              path={require('../../../assets/uploading-lottie.json')}
            />
          )}
        </Card>
      </View>
    </Modal>
  );
};

export default MedUpdateCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    height: '70%',
    width: 380,
    padding: 10,
    margin: 10,
  },
});
