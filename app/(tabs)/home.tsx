import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {

    return(

        <SafeAreaProvider>
            <SafeAreaView style = { styles.container }>
                <Text>Bem-vindo à tela inicial (home)</Text>
            </SafeAreaView>
        </SafeAreaProvider>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }

});

