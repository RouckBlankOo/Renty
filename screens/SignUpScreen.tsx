import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { CONSTANTS } from "../constants";

const SignUpScreen = () => {
  const [usePhone, setUsePhone] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSignUp = async () => {
    try {
      // Basic client-side validation
      if (usePhone) {
        if (!phoneNumber || !password || !confirmPassword) {
          Alert.alert("Error", "Please fill in all fields");
          return;
        }
        if (!/^\+\d{10,15}$/.test(phoneNumber)) {
          Alert.alert(
            "Error",
            "Invalid phone number. Use E.164 format (e.g., +21654311907)"
          );
          return;
        }
      } else {
        if (!email || !password || !confirmPassword) {
          Alert.alert("Error", "Please fill in all fields");
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          Alert.alert("Error", "Invalid email format");
          return;
        }
      }

      if (password.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }

      const endpoint = usePhone
        ? `${CONSTANTS.API_URL_PROD}/auth/register-phone`
        : `${CONSTANTS.API_URL_PROD}/auth/register`;
      const body = usePhone
        ? { phoneNumber, password, confirmPassword }
        : { email, password, confirmPassword };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (usePhone) {
        navigation.navigate("VerifyPhone", {
          userId: data.user._id,
          phoneNumber,
        })
      } else {
        Alert.alert("Success", data.message, [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]);
      }
    } catch (error: any) {
      console.log("Fetch error:", JSON.stringify(error, null, 2));
      Alert.alert(
        "Error",
        error.message || "Something went wrong. Please try again later."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          Sign up to get started with I Banking App
        </Text>

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>
            Sign up with {usePhone ? "Phone" : "Email"}
          </Text>
          <Switch
            value={usePhone}
            onValueChange={(value) => {
              setUsePhone(value);
              setEmail("");
              setPhoneNumber("");
            }}
            trackColor={{ false: "#ccc", true: "#6a5acd" }}
            thumbColor={usePhone ? "#fff" : "#fff"}
          />
        </View>

        {usePhone ? (
          <TextInput
            style={styles.input}
            placeholder="Phone Number (e.g., +21654311907)"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        )}

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.helperText}>
          Password must be at least 6 characters
        </Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#aaa"
            secureTextEntry={!isConfirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}
          >
            <Ionicons
              name={isConfirmPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Create account</Text>
        </TouchableOpacity>

        <Text style={styles.divider}>Or sign up with</Text>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <AntDesign name="google" size={20} color="#333" />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <AntDesign name="apple1" size={20} color="#333" />
            <Text style={styles.socialButtonText}>Apple</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Login")}
          >
            Log in
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
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 400,
    marginBottom: 10,
  },
  toggleLabel: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    width: "100%",
    maxWidth: 400,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
    maxWidth: 400,
  },
  icon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
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
  divider: {
    textAlign: "center",
    color: "#aaa",
    marginBottom: 20,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    maxWidth: 400,
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "45%",
    justifyContent: "center",
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
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

export default SignUpScreen;
