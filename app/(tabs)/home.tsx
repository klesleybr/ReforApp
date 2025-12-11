import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";


export default function HomeScreen() {

    const navigation = useNavigation();

    return(

        <SafeAreaProvider>
            <SafeAreaView style = { styles.container }>
                <Text>Bem-vindo à tela inicial (home)</Text>
                <Button title = "Voltar" onPress={ () => navigation.goBack() }></Button>
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

