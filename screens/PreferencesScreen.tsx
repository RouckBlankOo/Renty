import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const PreferencesScreen = () => {
  const [transactionType, setTransactionType] = useState<
    "rent" | "sell" | null
  >(null);
  const [realEstateOptions, setRealEstateOptions] = useState<string[]>([]);
  const [vehicleOptions, setVehicleOptions] = useState<string[]>([]);

  const toggleOption = (option: string, category: "realEstate" | "vehicle") => {
    if (category === "realEstate") {
      setRealEstateOptions((prev) =>
        prev.includes(option)
          ? prev.filter((item) => item !== option)
          : [...prev, option]
      );
    } else {
      setVehicleOptions((prev) =>
        prev.includes(option)
          ? prev.filter((item) => item !== option)
          : [...prev, option]
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Set Your Preferences</Text>

      {/* Transaction Type */}
      <View style={styles.transactionTypeContainer}>
        <TouchableOpacity
          style={[
            styles.transactionButton,
            transactionType === "rent" && styles.selectedButton,
          ]}
          onPress={() => setTransactionType("rent")}
        >
          <Text
            style={[
              styles.transactionButtonText,
              transactionType === "rent" && styles.selectedButtonText,
            ]}
          >
            Rent
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.transactionButton,
            transactionType === "sell" && styles.selectedButton,
          ]}
          onPress={() => setTransactionType("sell")}
        >
          <Text
            style={[
              styles.transactionButtonText,
              transactionType === "sell" && styles.selectedButtonText,
            ]}
          >
            Sell
          </Text>
        </TouchableOpacity>
      </View>

      {/* Real Estate Options */}
      <Text style={styles.label}>Real Estate</Text>
      <View style={styles.optionsContainer}>
        {["House", "Apartment", "Land", "Office"].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              realEstateOptions.includes(option) && styles.selectedOption,
            ]}
            onPress={() => toggleOption(option, "realEstate")}
          >
            <Text
              style={[
                styles.optionText,
                realEstateOptions.includes(option) && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Vehicle Options */}
      <Text style={styles.label}>Vehicles</Text>
      <View style={styles.optionsContainer}>
        {["Car", "Bus", "Truck", "Motorcycle"].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              vehicleOptions.includes(option) && styles.selectedOption,
            ]}
            onPress={() => toggleOption(option, "vehicle")}
          >
            <Text
              style={[
                styles.optionText,
                vehicleOptions.includes(option) && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  transactionTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  transactionButton: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#ddd",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#6a5acd",
  },
  transactionButtonText: {
    fontSize: 16,
    color: "#333",
  },
  selectedButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  optionButton: {
    width: "48%",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#ddd",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#4caf50",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOptionText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PreferencesScreen;
