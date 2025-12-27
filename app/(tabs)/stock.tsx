import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { useState } from "react";

import { useTheme, useNavigation } from "@react-navigation/native";
import { DrawerNavProps } from "../_layout";

import Header from "@/components/header";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import GeneralModal from "@/components/general-modal";

const stock : [] = [

]

export default function StockScreen() {

    const [visibleModal, setVisibleModal] = useState(false);
    const navigation = useNavigation<DrawerNavProps>();
    const { colors } = useTheme();

    return(

        <SafeAreaProvider>
            <SafeAreaView style = {{ ...styles.container, backgroundColor: colors.background }}>
                <Header iconType="arrow-back"/>
                <Modal transparent = { true } visible = { visibleModal }>
                    <GeneralModal isOpen = { visibleModal } setIsOpen= { setVisibleModal } />
                </Modal>
                <View style = {{ width: "90%", flex: 1, justifyContent: "center" }}>
                    {
                        stock.length === 0 ? (
                            <View style = {{ alignItems: "center", justifyContent: "center" }}>
                                <Text style = { styles.emptyTitle }>Nenhum produto foi registrado</Text>
                                <Text style = { styles.emptySubtitle }>Aperte no botão abaixo para adicionar um produto.</Text>
                                <TouchableOpacity style = { styles.button } onPress = { () => setVisibleModal(true) }>
                                    <Text style = { styles.buttonTitle }>Adicionar Produto</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null
                    }
                </View>
            </SafeAreaView>
        </SafeAreaProvider>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center"
    },

    emptyTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 22,
        textAlign: "center",
    },
    
    emptySubtitle: {
        color: "rgba(0, 0, 0, 0.5)",
        fontFamily: "Inter_400Regular",
        textAlign: "center",
        marginTop: 6,
        marginBottom: 20
    },

    button: {
        height: 32,
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0E9608",
        borderRadius: 5
    },

    buttonTitle: {
        color: "#FFFFFF",
        fontFamily: "Inter_700Bold",
    }

});