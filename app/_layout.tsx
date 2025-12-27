import { DarkTheme, DefaultTheme, NavigationContainer, Theme, ThemeProvider, useNavigation } from '@react-navigation/native';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AuthScreen from './(tabs)';
import HomeScreen from './(tabs)/home';
import StockScreen from './(tabs)/stock';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerNavigationProp } from "@react-navigation/drawer";
import CustomDrawerContent from '@/components/custom-drawer';
import { StyleSheet } from 'react-native';
import { Inter_400Regular, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

const MyDefaultTheme : Theme = {
  ...DefaultTheme,
  colors : {
    ...DefaultTheme.colors,
    primary: "#6D0808",
    background: "#E6E6E6",
    text: "#000000"
  },
  fonts: {
    ...DefaultTheme.fonts
  }
}

type RootParamsList = {
  Auth: undefined;
  Home: undefined;
  Stock: undefined;
}
export type StackNavigatorProps = NativeStackScreenProps<RootParamsList>;
export type DrawerNavProps = DrawerNavigationProp<RootParamsList>;

export default function RootStack() {

  const [loaded, error] = useFonts(
    { Inter_400Regular, Inter_700Bold }
  );

  useEffect(() => {
    if(loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error])

  if(!loaded && !error) return null;

  const Stack = createNativeStackNavigator<RootParamsList>();
  const Drawer = createDrawerNavigator();

  const  Screens =  () => {
    return(
      <Stack.Navigator initialRouteName= "Auth" screenOptions={ { headerShown: false } }>
        <Stack.Screen name = "Auth" component = { AuthScreen } options= {{  }}></Stack.Screen>
        <Stack.Screen name = "Home" component = { HomeScreen }></Stack.Screen>
        <Stack.Screen name = "Stock" component = { StockScreen }></Stack.Screen>
      </Stack.Navigator>   
    );
  }  

  // const colorScheme = useColorScheme();
  // ... value = { colorScheme === 'dark' ? DarkTheme : DefaultTheme} ...

  return(
    <ThemeProvider value = { MyDefaultTheme }>
      <Drawer.Navigator 
        screenOptions={ 
          { 
            headerShown: false, 
            drawerStyle: { backgroundColor: MyDefaultTheme.colors.primary }                                                 
          }
        } 
        initialRouteName = "Screens" 
        drawerContent = { (props) => <CustomDrawerContent {...props} /> }      

      >
        <Drawer.Screen options={{ popToTopOnBlur: true }} name = "Screens" component = { Screens }></Drawer.Screen>        
      </Drawer.Navigator>
    </ThemeProvider>
  );

}

const styles = StyleSheet.create({


});

