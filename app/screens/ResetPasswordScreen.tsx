import { Input } from "@ui-kitten/components";
import { StatusBar, StyleSheet, View } from "react-native";
import { useState } from "react";
import Toast from "react-native-toast-message";

interface ResetPasswordScreenProps {
  navigation: any;
}

function ResetPasswordScreen(props: ResetPasswordScreenProps) {
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  const login = () => {
    props.navigation.navigate("LoginScreen");
    // Toast.show({
    //   type: "error",
    //   text1: "Invalid OTP",
    //   text2: "Please try again",
    // });
  };

  return (
    <View style={styles.container}>
      <Toast />
      <View style={styles.passwordContainer}>
        <Input
          value={newPasswordValue}
          size="large"
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={true}
          onChangeText={(nextValue) => setNewPasswordValue(nextValue)}
        ></Input>
        <Input
          value={confirmPasswordValue}
          size="large"
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={true}
          onChangeText={(nextValue) => setConfirmPasswordValue(nextValue)}
        />
        {/* <Button  style={styles.button} onPress={login}>
          {" "}
          Change Password{" "}
        </Button> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    borderWidth: 0,
    width: "100%",
    height: 55,
    backgroundColor: "#E60000",
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    paddingTop: StatusBar.currentHeight,
  },
  input: {
    width: "100%",
    marginBottom: 16,
  },
  passwordContainer: {
    width: "84%",
    marginTop: "24%",
    alignItems: "center",
  },
});
export default ResetPasswordScreen;
