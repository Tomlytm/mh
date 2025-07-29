import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Animated 
} from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

interface CancellingReasonProps {
  toggleDismiss: any;
  toggleSubmit: (reason: string, reasonValue: string) => void;
}

export default function CancellingReasonModal(props: CancellingReasonProps) {
  const [selectedReason, setSelectedReason] = useState("customerUnavailable");
  const [reasonValue, setReasonValue] = useState("");
  const { t } = useTranslation();
  
  const submitScale = React.useRef(new Animated.Value(1)).current;
  const dismissScale = React.useRef(new Animated.Value(1)).current;

  const handleSubmitPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(submitScale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleSubmitPressOut = () => {
    Animated.spring(submitScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleDismissPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(dismissScale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleDismissPressOut = () => {
    Animated.spring(dismissScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const reasons = [
    {
      id: "customerUnavailable",
      icon: "account-off-outline",
      header: t("components.cancellingReasonModal.reasons.customerUnavailable.header"),
      body: t("components.cancellingReasonModal.reasons.customerUnavailable.body"),
    },
    {
      id: "others",
      icon: "help-circle-outline", 
      header: t("components.cancellingReasonModal.reasons.others.header"),
      body: t("components.cancellingReasonModal.reasons.others.body"),
    },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.dragHandle} />
      
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="cancel"
          size={32}
          color={colors.error}
        />
        <Text style={styles.title}>
          {t("components.cancellingReasonModal.title")}
        </Text>
      </View>

      <View style={styles.reasonsContainer}>
        {reasons.map((reason) => (
          <TouchableOpacity
            key={reason.id}
            style={[
              styles.reasonOption,
              selectedReason === reason.id && styles.reasonOptionSelected,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedReason(reason.id);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.reasonLeft}>
              <View style={[
                styles.radioButton,
                selectedReason === reason.id && styles.radioButtonSelected,
              ]}>
                {selectedReason === reason.id && (
                  <MaterialCommunityIcons
                    name="check"
                    size={16}
                    color={colors.secondary}
                  />
                )}
              </View>
              <MaterialCommunityIcons
                name={reason.icon as any}
                size={24}
                color={selectedReason === reason.id ? colors.primary : colors.textLight}
                style={styles.reasonIcon}
              />
            </View>
            <View style={styles.reasonContent}>
              <Text style={[
                styles.reasonHeader,
                selectedReason === reason.id && styles.reasonHeaderSelected,
              ]}>
                {reason.header}
              </Text>
              <Text style={styles.reasonBody}>
                {reason.body}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Additional Information</Text>
        <TextInput
          multiline={true}
          value={reasonValue}
          style={styles.textInput}
          placeholder={t(
            "components.cancellingReasonModal.placeholders.additionalInformation"
          )}
          placeholderTextColor={colors.textLight}
          onChangeText={(nextValue) => setReasonValue(nextValue)}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Animated.View style={[{ transform: [{ scale: dismissScale }] }, styles.buttonWrapper]}>
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={props.toggleDismiss}
            onPressIn={handleDismissPressIn}
            onPressOut={handleDismissPressOut}
            activeOpacity={0.8}
          >
            <Text style={styles.dismissButtonText}>
              {t("components.cancellingReasonModal.buttons.dismiss.text")}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[{ transform: [{ scale: submitScale }] }, styles.buttonWrapper]}>
          <TouchableOpacity
            onPress={() => props.toggleSubmit(selectedReason, reasonValue)}
            onPressIn={handleSubmitPressIn}
            onPressOut={handleSubmitPressOut}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={colors.gradient.primary}
              style={styles.submitButton}
            >
              <MaterialCommunityIcons
                name="send"
                size={16}
                color={colors.secondary}
                style={styles.submitIcon}
              />
              <Text style={styles.submitButtonText}>
                {t("components.cancellingReasonModal.buttons.submit.text")}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 32,
    maxHeight: "80%",
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    textAlign: "center",
    marginTop: 12,
  },
  reasonsContainer: {
    marginBottom: 24,
  },
  reasonOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.support,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  reasonOptionSelected: {
    backgroundColor: colors.primary + "08",
    borderColor: colors.primary + "40",
  },
  reasonLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  reasonIcon: {
    marginRight: 8,
  },
  reasonContent: {
    flex: 1,
  },
  reasonHeader: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.text,
    marginBottom: 4,
  },
  reasonHeaderSelected: {
    color: colors.primary,
  },
  reasonBody: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.textLight,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: colors.support,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    fontSize: 16,
    fontFamily: "Inter",
    color: colors.text,
    minHeight: 100,
    maxHeight: 120,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  buttonWrapper: {
    flex: 1,
  },
  dismissButton: {
    backgroundColor: colors.support,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.text,
  },
  submitButton: {
    flexDirection: "row",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.secondary,
  },
});
