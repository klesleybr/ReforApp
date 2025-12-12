import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { View, Text, StyleSheet, Button } from "react-native";

import { useTheme } from "@react-navigation/native";
import Header from "@/components/header";



export default function HomeScreen() {

    const { colors } = useTheme();

    return(

        <SafeAreaProvider>
            <SafeAreaView style = { [styles.container, { backgroundColor: colors.background }] }>
                <Header iconType="menu"/>
                <Text style = {{ fontFamily: "Inter_400Regular", fontSize: 17 }}>Bem-vindo(a) à tela inicial</Text>
            </SafeAreaView>
        </SafeAreaProvider>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",        
    }

});

