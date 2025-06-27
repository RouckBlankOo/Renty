import { createStackNavigator } from "@react-navigation/stack";
import CarsScreen from "../screens/CarsScreen";

const Stack = createStackNavigator();

export default function AutoMobileNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cars"
        component={CarsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
