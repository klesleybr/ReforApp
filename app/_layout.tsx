import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import AuthScreen from './(tabs)';
import HomeScreen from './(tabs)/home';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export const unstable_settings = {
  anchor: '(tabs)',
};

type RootStackParamsList = {
  Auth: undefined;
  Home: undefined;
}
export type StackNavigatorProps = NativeStackScreenProps<RootStackParamsList>;

const Stack = createNativeStackNavigator<RootStackParamsList>();
export default function RootStack() {

  return(
    <Stack.Navigator initialRouteName= "Auth" screenOptions={{ headerShown: false }}>
      <Stack.Screen name = "Auth" component = { AuthScreen }  ></Stack.Screen>
      <Stack.Screen name = "Home" component = { HomeScreen }></Stack.Screen>
    </Stack.Navigator>
  );

}




/*
export default function RootLayout() {
  
  const colorScheme = useColorScheme();

  return (
    // value = {colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    
    <ThemeProvider value={ DefaultTheme }>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name = "Auth" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    
  );
  
}
  */



