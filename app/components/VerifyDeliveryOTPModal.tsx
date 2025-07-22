import { Button, Text } from "@ui-kitten/components";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";

interface VerifyDeliveryOTPProps {
  toggleDismiss: any;
  resendVerificationOTP: any;
  confirmDelivery: (code: string) => void;
}

export default function VerifyDeliveryOTPModal(props: VerifyDeliveryOTPProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);
  const [inputStyle, setInputStyle] = useState(styles.box);
  const { t, i18n } = useTranslation();
  const handleOtpChange = (value: string, index: number) => {
    let newOtp = [...otp];

    if (value.length > 1) {
      // Handle pasting scenario: spread characters across input boxes
      const otpArray = value.split("").slice(0, otp.length);
      otpArray.forEach((char, i) => {
        newOtp[index + i] = char;
      });
      setOtp(newOtp);

      // Focus on the next available input field
      const nextInputIndex = Math.min(index + otpArray.length, otp.length - 1);
      inputs.current[nextInputIndex]?.focus();
    } else {
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input field if available
      if (value && index < otp.length - 1) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    setInputStyle({ ...styles.box, borderColor: "#D5D5D5" });

    if (e.nativeEvent.key === "Backspace") {
      const newOtp = [...otp];

      if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text category="h6">
        {t("components.verifyDeliveryOTPModal.otpPrompt")}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 16,
          paddingHorizontal: 24,
        }}
      >
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            autoComplete="one-time-code"
            style={inputStyle}
            maxLength={index === 0 ? otp.length : 1}
            keyboardType="numeric"
            onChangeText={(value) => handleOtpChange(value, index)}
            value={digit}
            ref={(input) => {
              inputs.current[index] = input;
            }}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>
      <Text
        style={{ color: "#E60000", fontWeight: "700", alignSelf: "flex-start" }}
        onPress={props.resendVerificationOTP}
      >
        {t("components.verifyDeliveryOTPModal.resendOtp")}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 24,
        }}
      >
        <Button style={styles.declineButton} onPress={props.toggleDismiss}>
          {(evaProps:any) => (
            <Text
              {...evaProps}
              style={{ color: "#616161", fontSize: 14, fontWeight: "700" }}
            >
              {t("components.verifyDeliveryOTPModal.dismissButton")}
            </Text>
          )}
        </Button>
        <Button
          style={styles.acceptButton}
          onPress={() => props.confirmDelivery(otp.join(""))}
        >
          {(evaProps:any) => (
            <Text
              {...evaProps}
              style={{ color: "#F5F5F5", fontSize: 14, fontWeight: "700" }}
            >
              {t("components.verifyDeliveryOTPModal.verifyButton")}
            </Text>
          )}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  acceptButton: {
    borderRadius: 16,
    borderWidth: 0,
    width: "36%",
    height: 48,
    justifyContent: "center",
    backgroundColor: "#E60000",
  },
  box: {
    borderWidth: 1,
    borderColor: "#D5D5D5",
    width: "14%",
    height: 40,
    margin: 10,
    textAlign: "center",
    fontSize: 20,
  },
  container: {
    width: "auto",
    backgroundColor: "#FFF",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
  },
  declineButton: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#F5F5F5",
    width: "36%",
    height: 48,
    justifyContent: "center",
    backgroundColor: "#FFF",
    marginRight: 24,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D5D5D5",
    marginTop: 10,
  },
  line: {
    width: 45,
    height: 5,
    backgroundColor: "#D5D5D5",
    marginBottom: 8,
  },
  reasonBody: {
    fontSize: 12,
    fontWeight: "400",
    color: "#757575",
  },
  reasonHeader: {
    fontSize: 16,
    fontWeight: "700",
  },
});

// import { Button, Text } from "@ui-kitten/components";
// import React, { useRef, useState } from "react";
// import {
//   KeyboardAvoidingView,
//   NativeSyntheticEvent,
//   StyleSheet,
//   TextInput,
//   TextInputChangeEventData,
//   TextInputKeyPressEventData,
//   View,
// } from "react-native";

// interface VerifyDeliveryOTPProps {
//   toggleDismiss: any;
//   resendVerificationOTP: any;
//   confirmDelivery: (code: string) => void;
// }

// export default function VerifyDeliveryOTPModal(props: VerifyDeliveryOTPProps) {
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const inputs = useRef<(TextInput | null)[]>([]);
//   const [inputStyle, setInputSTyle] = useState(styles.box);

// const handleOtpChange = (
//   e: NativeSyntheticEvent<TextInputChangeEventData>,
//   index: number
// ) => {
//   const value = e.nativeEvent.text;
//   let newOtp = [...otp];

//   if (value.length > 1) {
//     // Handle pasting scenario: spread characters across input boxes
//     const otpArray = value.split("").slice(0, otp.length);
//     otpArray.forEach((char, i) => {
//       newOtp[index + i] = char;
//     });
//     setOtp(newOtp);

//     // Focus on the next available input field
//     const nextInputIndex = Math.min(index + otpArray.length, otp.length - 1);
//     inputs.current[nextInputIndex]?.focus();
//   } else {
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Move focus to the next input field if available
//     if (value && index < otp.length - 1) {
//       inputs.current[index + 1]?.focus();
//     }
//   }
// };

//   const handleKeyPress = (
//     e: NativeSyntheticEvent<TextInputKeyPressEventData>,
//     index: number
//   ) => {
//     setInputSTyle({ ...styles.box, borderColor: "#D5D5D5" });

//     if (e.nativeEvent.key === "Backspace") {
//       const newOtp = [...otp];

//       if (index > 0) {
//         newOtp[index - 1] = "";
//         setOtp(newOtp);
//         inputs.current[index - 1]?.focus();
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text category="h6">
//         Enter customer verification OTP to confirm delivery
//       </Text>
//       <View style={styles.otpContainer}>
//         {otp.map((digit, index) => (
//           <TextInput
//             autoFocus={true}
//             key={index}
//             style={inputStyle}
//             maxLength={1}
//             keyboardType="numeric"
//             onChange={(e) => {
//               handleOtpChange(e, index);
//             }}
//             value={digit}
//             ref={(input) => {
//               inputs.current[index] = input;
//             }}
//             onKeyPress={(e) => handleKeyPress(e, index)}
//           />
//         ))}
//       </View>
//       <Text style={styles.resendText} onPress={props.resendVerificationOTP}>
//         RESEND VERIFICATION OTP
//       </Text>
//       <View style={styles.buttonContainer}>
//         <Button style={styles.declineButton} onPress={props.toggleDismiss}>
//           {(evaProps) => (
//             <Text {...evaProps} style={styles.declineButtonText}>
//               Dismiss
//             </Text>
//           )}
//         </Button>
//         <Button
//           style={styles.acceptButton}
//           onPress={() => props.confirmDelivery(otp.join(""))}
//         >
//           {(evaProps) => (
//             <Text {...evaProps} style={styles.acceptButtonText}>
//               Verify
//             </Text>
//           )}
//         </Button>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   acceptButton: {
//     borderRadius: 16,
//     width: "36%",
//     height: 48,
//     justifyContent: "center",
//     backgroundColor: "#E60000",
//   },
//   acceptButtonText: {
//     color: "#F5F5F5",
//     fontSize: 14,
//     fontWeight: "700",
//     borderWidth: 0,
//   },
//   declineButton: {
//     borderRadius: 16,
//     borderWidth: 1.5,
//     borderColor: "#F5F5F5",
//     width: "36%",
//     height: 48,
//     justifyContent: "center",
//     backgroundColor: "#FFF",
//     marginRight: 24,
//   },
//   declineButtonText: {
//     color: "#616161",
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   box: {
//     borderWidth: 1,
//     borderColor: "#D5D5D5",
//     width: "14%",
//     height: 40,
//     margin: 10,
//     textAlign: "center",
//     fontSize: 20,
//   },
//   container: {
//     backgroundColor: "#FFF",
//     alignItems: "center",
//     padding: 16,
//     borderRadius: 16,
//   },
//   otpContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 16,
//     paddingHorizontal: 24,
//   },
//   resendText: {
//     color: "#E60000",
//     fontWeight: "700",
//     alignSelf: "flex-start",
//     marginTop: 10,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     marginTop: 24,
//   },
// });
