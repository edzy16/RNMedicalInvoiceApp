import React, {useEffect, useRef} from 'react';
import {Modal, View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  path: string;
};
const LottieModal = ({visible, onClose, path}: Props) => {
  const animation = useRef(null);
  // useEffect(() => {
  //   // You can control the ref programmatically, rather than using autoPlay
  //   animation.current?.play() as never;
  // }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.animationContainer}>
          <LottieView
            // ref={animation}
            autoPlay
            loop
            style={{
              width: 200,
              height: 200,
              backgroundColor: '#eee',
            }}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={path}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  animationContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
});

export default LottieModal;
