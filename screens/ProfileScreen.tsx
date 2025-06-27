import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CONSTANTS } from "../constants/index";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";

const ProfileScreen = () => {
  interface User {
    _id: string;
    email?: string;
    phoneNumber?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  }

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        if (!token) {
          Alert.alert("Error", "Please log in again", [
            { text: "OK", onPress: () => navigation.navigate("Login") },
          ]);
          return;
        }

        const response = await fetch(`${CONSTANTS.API_URL_PROD}/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          await AsyncStorage.removeItem("jwtToken");
          Alert.alert("Session Expired", "Please log in again", [
            { text: "OK", onPress: () => navigation.navigate("Login") },
          ]);
          return;
        }

        const data = await response.json();
        console.log("Profile Response:", data);

        if (data.success) {
          setUser(data.user);
        } else {
          Alert.alert("Error", data.message);
        }
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        Alert.alert("Error", "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6a5acd" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>Unable to load profile</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.info}>ID: {user._id}</Text>
      {user.email && <Text style={styles.info}>Email: {user.email}</Text>}
      {user.phoneNumber && (
        <Text style={styles.info}>Phone: {user.phoneNumber}</Text>
      )}
      <Text style={styles.info}>
        Email Verified: {user.emailVerified ? "Yes" : "No"}
      </Text>
      <Text style={styles.info}>
        Phone Verified: {user.phoneVerified ? "Yes" : "No"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});

export default ProfileScreen;
