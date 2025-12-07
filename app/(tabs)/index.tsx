import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Text, View, StyleSheet, TextInput, ImageBackground, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../../assets/images/vertical-logo.svg";


export default function AuthScreen() {

    return(

        <SafeAreaProvider>        
            <SafeAreaView style = { styles.container }>
                <ImageBackground 
                    source = {require("../../assets/images/auth-background-cort.jpg")} 
                    style = { styles.imageBackgroundContainer }
                    imageStyle = { styles.imageBackground }
                >
                    <LinearGradient 
                        colors={['hsla(0, 82%, 44%, 0.88)', 'rgba(109, 8, 8, 0.7)', "rgba(24, 24, 168, 0.6)"]} 
                        start={{ x: 0.5, y: 0.3}} 
                        style = { styles.linearGradient }
                    />                    
                    <Logo style = { styles.logo }/>
                    <TextInput placeholder="Digite o seu usuário" style = { styles.textInput } autoFocus={true} placeholderTextColor={"rgba(28, 13, 13, 0.5)"}></TextInput>
                    <TextInput placeholder="Digite a sua senha" placeholderTextColor={"rgba(0, 0, 0, 0.5)"} secureTextEntry={true} style = { styles.textInput }></TextInput>
                    <TouchableOpacity style = { styles.button }>
                        <Text style = { styles.text}>Entrar</Text>
                    </TouchableOpacity>                
                </ImageBackground>
            </SafeAreaView>
        </SafeAreaProvider>

        
    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    imageBackgroundContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 17,
    },

    imageBackground: {
        width: "100%",
        height: "100%"
    },

    linearGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
    },

    logo: {
        zIndex: 1,
        marginBottom: 50
    },

    textInput: {
        height: 39,
        width: "75%",
        backgroundColor: "#FFFFFF",
        zIndex: 1,
        paddingLeft: 13,
        borderRadius: 3,
        fontSize: 15,
    },

    button: {
        borderStyle: "solid",
        borderColor: "#FFFFFF",
        borderWidth: 2,
        paddingHorizontal: 18,
        paddingVertical: 7,
        borderRadius: 5,
        marginTop: 23,
    },

    text: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 20
    }

});