import React from "react";
import { Snackbar } from "react-native-paper";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  message: string;
  snackbarColor: boolean;
};

const CustomSnackbar = ({
  visible,
  onDismiss,
  message,
  snackbarColor,
}: Props) => {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={Snackbar.DURATION_SHORT}
      style={{ backgroundColor: snackbarColor ? "#93af5f" : "#af645f" }}
      action={{
        label: "X",
        onPress: onDismiss,
      }}
    >
      {message}
    </Snackbar>
  );
};

export default CustomSnackbar;
