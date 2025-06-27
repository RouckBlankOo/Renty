import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  useNavigation,
  useRoute,
  NavigationProp,
} from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { CONSTANTS } from "../constants";

const API_URL = CONSTANTS.API_URL_PROD;

const VerifyPhoneScreen = () => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<TextInput[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { userId, phoneNumber } = route.params as {
    userId: string;
    phoneNumber: string;
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only allow single digit

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Move to next input if digit entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length !== 6) {
      Alert.alert("Error", "Please enter a 6-digit verification code");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      // Navigate to Login on success
      navigation.navigate("Login");
    } catch (error: any) {
      console.log("Verification error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        code,
        userId,
        url: `${API_URL}/api/auth/verify-phone`,
      });
      Alert.alert(
        "Error",
        error.message ||
          "Failed to verify phone number. Please check your network and try again."
      );
    }
  };

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    if (digits.every((digit) => digit !== "")) {
      handleVerify();
    }
  }, [digits]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Verify Phone Number</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to {phoneNumber} via WhatsApp
        </Text>

        <View style={styles.codeContainer}>
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref!)}
              style={styles.codeInput}
              value={digit}
              onChangeText={(value) => handleDigitChange(index, value)}
              onKeyPress={({ nativeEvent: { key } }) =>
                handleKeyPress(index, key)
              }
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              autoFocus={index === 0}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Didn't receive a code?{" "}
          <Text style={styles.link} onPress={() => navigation.goBack()}>
            Try again
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    maxWidth: 300,
    marginBottom: 20,
  },
  codeInput: {
    width: 40,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    textAlign: "center",
    fontSize: 18,
    color: "#333",
  },
  button: {
    backgroundColor: "#6a5acd",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    color: "#666",
  },
  link: {
    color: "#6a5acd",
    fontWeight: "bold",
  },
});

export default VerifyPhoneScreen;
