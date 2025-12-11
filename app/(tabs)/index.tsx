import { useState, useEffect } from "react";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Text, View, StyleSheet, TextInput, ImageBackground, TouchableOpacity, ActivityIndicator } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import Logo from "../../assets/images/vertical-logo.svg";

import { StackNavigatorProps } from "../_layout";

import { getAuth, signInWithEmailAndPassword, User } from "firebase/auth";
import firebase from "firebase/app";
import { app } from "../../config/firebaseConfig.js";

export default function AuthScreen({ navigation } : StackNavigatorProps) { 

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const anyFieldEmpty : boolean = email == "" || password == "";

    const auth = getAuth(app);
    const [user, setUser] = useState<User | undefined>(undefined);

    const login = async () => await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            setUser(userCredential.user);
            setEmail("");
            setPassword("");
            navigation.navigate("Home");
        }).catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });

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
                    <TextInput 
                        placeholder="Digite o seu e-mail" 
                        placeholderTextColor={"rgba(28, 13, 13, 0.5)"}
                        style = { styles.textInput } 
                        autoFocus={ true }
                        value = { email }
                        onChangeText = { value => setEmail(value) }                       
                    />
                    <TextInput 
                        placeholder="Digite a sua senha" 
                        placeholderTextColor={"rgba(0, 0, 0, 0.5)"} 
                        secureTextEntry={true} 
                        style = { styles.textInput }
                        value={ password }
                        onChangeText={ value => setPassword(value) }
                    />
                    <TouchableOpacity 
                        style = { [styles.button, { borderColor: anyFieldEmpty ? "rgba(255, 255, 255, 0.4)" : "#FFFFFF"}] } 
                        onPress={ () => {
                            setIsLoading(true);
                            login();
                            setIsLoading(false);
                        } }
                        disabled = { anyFieldEmpty ? true : false }
                    >
                        {
                            isLoading ? <Text>...</Text> : 
                                <Text style = { [styles.text, { color: anyFieldEmpty ? "rgba(255, 255, 255, 0.4)" : "#FFFFFF" }] }>Entrar</Text>
                        }
                    </TouchableOpacity>                    
                </ImageBackground>
            </SafeAreaView>
        </SafeAreaProvider>

        
    );

}

declare type Conditional = {
    isLoading : boolean
}

function ButtonContent({ isLoading } : Conditional) {

    if(isLoading) {
        return <ActivityIndicator color={ "#FFFFFF" } size={ 20 }></ActivityIndicator>
    } else {
        return <Text style = { styles.text}>Entrar</Text>;
    }

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

    buttonDisabled: {
        borderStyle: "solid",
        borderColor: "#a5a5a5ff",
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
    },

});