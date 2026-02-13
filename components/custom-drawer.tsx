import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Button, View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import Foundation from '@expo/vector-icons/Foundation';
import { useState } from "react";
import Entypo from '@expo/vector-icons/Entypo';
import { auth } from "@/config/firebaseConfig";
import { useAuth } from "@/context/auth-context";
import { signOut } from "firebase/auth";

const username : string = "Usuário Padrão"

export default function CustomDrawerContent ({ navigation } : DrawerContentComponentProps) {    
    
    const [expandSale, setExpandSale] = useState<boolean>(false);
    const { setLoggedUser } = useAuth();

    const signOutUser = async() => {
        signOut(auth).then((response) => {
            console.log(response);
            setLoggedUser ? setLoggedUser(null) : null;
        }).catch((error) => console.log(error));
    }

    return(
        <SafeAreaProvider>
            <SafeAreaView style = {{ flex: 1 }}>
                <MaterialCommunityIcons name = "close-thick" size = { 24 } color = "#FFFFFF" style = { styles.close } onPress = { () => navigation.closeDrawer() } />
                <DrawerContentScrollView contentContainerStyle = {{ gap: 20, marginBottom: "10%"}} scrollEnabled = { true }>
                <View style = {{ alignItems: "center", gap: 17 }}>
                    <Image source = { require("@/assets/images/user-default.png") } style = { { width: 143, height: 143, resizeMode: "cover", borderRadius: 100 }}></Image>
                    <Text style = {{ color: "#FFFFFF", fontSize: 12, fontFamily: "Inter_400Regular", opacity: 0.5 }}>{ username }</Text>
                </View>
                <View>
                    <DrawerItem 
                        label = "Início" 
                        onPress={() => navigation.navigate("Screens", { screen: "Home" }) } 
                        icon = { () => <Octicons name = "home" color = "#000000" size = { 24 } style = { styles.icon }/>}   
                        labelStyle = { styles.label }
                        style = { styles.item }                                         
                    />
                    <DrawerItem 
                        label = "Dashboard" 
                        onPress={() => null } 
                        icon = { () => <Feather name = "pie-chart" color = "#000000" size = { 24 } style = { styles.icon }/>}   
                        labelStyle = { styles.label }
                        style = { styles.item }                                         
                    /> 
                    <View style = { styles.item }>
                        <DrawerItem 
                            label = "Vendas" 
                            onPress={() => setExpandSale(prev => !prev) } 
                            icon = { () => <FontAwesome name = "usd" color = "#000000" size = { 24 } style = { [styles.icon, { paddingHorizontal: 10}] }/>}   
                            labelStyle = { styles.label }                                                           
                        />                        
                        {
                            expandSale ? (
                                <View style = { styles.saleOptionsContainer }>
                                    <DrawerItem                                         
                                        label = "Realizar Venda"
                                        onPress={ () => {navigation.navigate("Screens", { screen: "Sales" }); setExpandSale(false)} }
                                        labelStyle = {{ ...styles.label, opacity: 0.8, fontSize: 15 }}
                                        icon = { () => <Entypo name="triangle-right" size={22} color = "#FFFFFF" style = {{ opacity: 0.8, marginLeft: "10%" }}/> }
                                        style = { styles.saleOptions }
                                    />
                                    <DrawerItem 
                                        label = "Consultar Vendas"
                                        onPress={ () => {navigation.navigate("Screens", { screen: "ShowSales" }); setExpandSale(false)} }
                                        labelStyle = {{ ...styles.label, opacity: 0.8, fontSize: 15 }}
                                        icon = { () => <Entypo name="triangle-right" size={22} color = "#FFFFFF" style = {{ opacity: 0.8, marginLeft: "10%" }}/> }
                                    />
                                </View>
                            ) : null
                        }
                    </View>
                     
                    <DrawerItem 
                        label = "Estoque" 
                        onPress={() => navigation.navigate("Screens", { screen: "Stock" }) } 
                        icon = { () => <AntDesign name = "code-sandbox" color = "#000000" size = { 24 } style = { styles.icon }/>}   
                        labelStyle = { styles.label }
                        style = { styles.item }                                         
                    /> 
                    <DrawerItem 
                        label = "Ganhos e Gastos" 
                        onPress={() => null } 
                        icon = { () => <FontAwesome name = "exchange" color = "#000000" size = { 23 } style = { styles.icon }/>}   
                        labelStyle = { styles.label }
                        style = { styles.item }                                         
                    /> 
                    <DrawerItem 
                        label = "Relatórios" 
                        onPress={() => navigation.navigate("Screens", { screen: "Reports" }) } 
                        icon = { () => <Foundation name = "page-export-pdf" color = "#000000" size = { 23 } style = { [styles.icon, { paddingHorizontal: 7 }] }/>}   
                        labelStyle = { styles.label }
                        style = { styles.item }                                         
                    /> 
                    <DrawerItem 
                        label = "Participantes" 
                        onPress={() => null } 
                        icon = { () => <Feather name = "users" color = "#000000" size = { 23 } style = { [styles.icon, { paddingHorizontal: 5 }] }/>}   
                        labelStyle = { styles.label }
                        style = { styles.item }                                         
                    />  
                </View>
                <View style = {{ width: "100%", alignItems: "center", marginTop: "10%" }}>
                    <TouchableOpacity style = { styles.logout } onPress={ () => { navigation.closeDrawer(); signOutUser(); } }>
                        <Text style = { styles.label }>Sair</Text>
                        <MaterialCommunityIcons name = "logout" color = "#FFFFFF" size = { 19 } />
                    </TouchableOpacity>
                </View>    
            </DrawerContentScrollView>    
            </SafeAreaView>
        </SafeAreaProvider>  
    );

}

const styles = StyleSheet.create({            

    close: {
        position: "absolute",
        top: 40,
        marginLeft: "4%",
        zIndex: 1
    },

    label: {        
        color: "#FFFFFF",
        fontSize: 16,
        fontFamily: "Inter_400Regular"
    },

    icon: {
        backgroundColor: "#FFFFFF",
        borderRadius: 50,
        padding: 4
    },

    item: {                   
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 0,                
    },

    logout: {                        
        paddingVertical: 4,
        paddingHorizontal: 11,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FFFFFF",
        borderRadius: 5,
        gap: 5         
    },
    
    saleOptionsContainer: {
        
        
    },

    saleOptions: {        
        justifyContent: "center",
        
    },

});
