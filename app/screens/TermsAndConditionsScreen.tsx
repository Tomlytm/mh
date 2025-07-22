import { Text } from "@ui-kitten/components";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface TermsAndConditionScreenProps {
  navigation: any;
}

function TermsAndConditionsScreen(props: TermsAndConditionScreenProps) {
  const loadRootTab = () => {
    props.navigation.navigate("MyTabs");
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.termsContainer}>
        <Text style={[styles.text, { paddingBottom: 12 }]}>
          {" "}
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.{" "}
        </Text>
        <Text category="h6" style={{ paddingBottom: 12 }}>
          {" "}
          Location Tracking{" "}
        </Text>
        <Text style={[styles.text, { paddingBottom: 12 }]}>
          {" "}
          When an unknown printer took a galley of type and scrambled it to make
          a type specimen book{" "}
        </Text>
        <Text category="h6" style={{ paddingBottom: 12 }}>
          {" "}
          Time Tracking{" "}
        </Text>
        <Text style={[styles.text, { paddingBottom: 12 }]}>
          {" "}
          When an unknown printer took a galley of type and scrambled it to make
          a type specimen book{" "}
        </Text>
        <Text style={[styles.text, { paddingBottom: 12 }]}>
          {" "}
          If you agree with the terms, tap the agree button below.{" "}
        </Text>
        <View style={styles.buttonContainer}>
          {/* <Button style={styles.button} onPress={loadRootTab}>
            {" "}
            Agree & Continue{" "}
          </Button> */}
          <Text style={styles.text}>
            {" "}
            By tapping “Agree & Continue”, you agree to Markethub's{" "}
            <Text style={{ color: "#E60000" }}>
              Terms & Conditions
            </Text> and <Text style={{ color: "#E60000" }}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    borderWidth: 0,
    width: "100%",
    height: 55,
    backgroundColor: "#E60000",
    marginBottom: 24,
  },
  buttonContainer: {
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    paddingTop: StatusBar.currentHeight,
  },
  termsContainer: {
    width: "92%",
    marginTop: "8%",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    color: "#616161",
    lineHeight: 26.4,
  },
});
export default TermsAndConditionsScreen;
