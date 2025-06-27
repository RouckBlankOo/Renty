// components/SwipeCard.tsx
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  PanResponder,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Property } from "../data/properties";
import { useRef } from "react";

const { width } = Dimensions.get("window");

interface SwipeCardProps {
  property: Property;
  onSwipe: (direction: "left" | "right", propertyId: string) => void;
}

export default function SwipeCard({ property, onSwipe }: SwipeCardProps) {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        translateX.value = gestureState.dx;
        rotate.value = gestureState.dx * 0.05;
        opacity.value = 1 - Math.abs(gestureState.dx) / (width * 0.5);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const offsetX = gestureState.dx;
        if (offsetX > 100) {
          translateX.value = withSpring(width * 2);
          opacity.value = withSpring(0);
          setTimeout(() => {
            onSwipe("right", property.id);
            translateX.value = withSpring(0); // Reset position
            opacity.value = withSpring(1);
            rotate.value = withSpring(0);
          }, 300);
        } else if (offsetX < -100) {
          translateX.value = withSpring(-width * 2);
          opacity.value = withSpring(0);
          setTimeout(() => {
            onSwipe("left", property.id);
            translateX.value = withSpring(0); // Reset position
            opacity.value = withSpring(1);
            rotate.value = withSpring(0);
          }, 300);
        } else {
          translateX.value = withSpring(0);
          rotate.value = withSpring(0);
          opacity.value = withSpring(1);
        }
      },
    })
  ).current;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.card, animatedStyle]}
      {...panResponder.panHandlers}
    >
      <Image source={{ uri: property.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.location}>{property.location}</Text>
        <Text style={styles.price}>
          {property.currency}
          {property.price.toLocaleString()}/mo
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  info: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  location: {
    fontSize: 14,
    color: "#64748b",
    marginVertical: 4,
  },
  price: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "bold",
  },
});
