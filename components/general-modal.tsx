import React, { ReactNode } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import type { DimensionValue, InputModeOptions } from "react-native";

type Props = {
    type?: "stock" | "confirmation",
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

type TextInputCustomProps = {
    title: string,
    thereHint?: boolean,
    hint?: string,
    width?: DimensionValue | undefined,
    height?: DimensionValue | undefined,
    inputMode?: InputModeOptions | undefined,
    multiline?: boolean
}

export default function GeneralModal({ type = "stock", isOpen = false, setIsOpen } : Props) {

    if(type === "stock" || type === undefined)
        return <StockModal isOpen = { isOpen } setIsOpen= { setIsOpen } />;

}

function StockModal({ isOpen, setIsOpen } : Props) {
    
    return(
        <View style = { styles.container }>
            <View style = { styles.background }>
                <MaterialCommunityIcons name = "close-thick" onPress={ () => setIsOpen(false)} color = "#6D0808" size = { 24 } style = { styles.closeIcon } />
                <Text style = { styles.title }>Novo Produto</Text>
                <Text style = { styles.hint }>Preencha as informações abaixo para adicionar um produto ao estoque.</Text>
                <View style = { styles.textInputContainer }>
                    <TextInputCustom title = "Nome" width = { "70%" }/>
                    <TextInputCustom title = "Quantidade" width = { "30%" } inputMode = "numeric"/>
                </View>
                <View style = {{ ... styles.textInputContainer, marginVertical: 10 }}>
                    <TextInputCustom title = "Custo Unitário" width = { "50%" } inputMode = "decimal" />
                    <TextInputCustom title = "Preço Unitário" width = { "50%" } inputMode = "decimal" />
                </View>
                <View style = { styles.textInputContainer }>
                    <TextInputCustom title = "Descrição" width = { "100%" } height= { 80 } multiline = { true }/>
                </View>
                
                <TouchableOpacity style = { styles.button } onPress={ () => setIsOpen(false) }>
                    <Text style = { styles.buttonText }>Adicionar</Text>
                </TouchableOpacity>
            </View>            
        </View>
    );

}

function TextInputCustom({ title, width = undefined, height = 35, inputMode = undefined, multiline = false } : TextInputCustomProps) {

    return(
        <View style = {{ width: width, gap: 8 }}>
            <Text style = {{ fontFamily: "Inter_700Bold", fontSize: 10, marginLeft: 15 }}>{ title }</Text>
            <TextInput 
                style = {{ 
                    backgroundColor: "#E9E9E9", 
                    height: height, 
                    borderRadius: 3, 
                    paddingHorizontal: 13 
                }} 
                inputMode = { inputMode }
                multiline = { multiline }
            />
        </View>
    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",        
    },

    background: {
        backgroundColor: "#FFFFFF",
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 50,
    },

    closeIcon: {
        position: "absolute",
        top: 16,
        right: 16
    },

    title: {
        fontFamily: "Inter_700Bold",
        fontSize: 22,
        textAlign: "center"
    },

    hint: {
        fontFamily: "Inter_400Regular",
        fontSize: 12,
        color: "#959595",
        textAlign: "center",
        marginVertical: 13,
        width: "80%"
    },

    textInputContainer: {
        flexDirection: "row",
        gap: 9,
        alignItems: "center",
        justifyContent: "center",
        width: "90%"
    },

    button: {
        height: 40,
        width: "80%",
        backgroundColor: "#0E9608",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        marginTop: 25
    },

    buttonText: {
        fontFamily: "Inter_700Bold",
        fontSize: 15,
        textAlign: "center",
        color: "#FFFFFF"
    }

});