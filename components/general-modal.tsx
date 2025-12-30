import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import type { DimensionValue, InputModeOptions } from "react-native";
import type { Product } from "@/types/definitions";
import Decimal from "decimal.js";

type Props = {
    type?: "stock" | "confirmation",
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    onSubmit?: () => void,
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

export default function GeneralModal({ type = "stock", isOpen = false, setIsOpen, onSubmit } : Props) {

    if(type === "stock" || type === undefined)
        return <StockModal isOpen = { isOpen } setIsOpen= { setIsOpen } onSubmit={ onSubmit } />;

}

function StockModal({ isOpen, setIsOpen, onSubmit } : Props) {

    const [priceString, setPriceString] = useState<string>("0");
    const [costString, setCostString] = useState<string>("0");

    const [product, setProduct] = useState<Product>({
        name: "",
        amount: 0,
        status: true,
        price: 0,
        sold: 0,
        cost: 0,
        description: "",
        createdAt: undefined,
        updatedAt: undefined
    });

    const formatDecimal = (value : string, prev : string, attribute : "cost" | "price") => {
        
        if(value === "," || value === ".") {
            if(prev === "")
                return "0."
            if(!prev.includes("."))
                return prev + ".";
        } else if(!isNaN(Number(value))) {
            if(attribute === "cost") {
                if(value !== "") {
                    setProduct({ ...product, cost: Number(value)});
                } else {
                    setProduct({ ...product, cost: Number(value)});
                }
            } else if(attribute === "price") {
                if(value !== "") {
                    setProduct({ ...product, price: Number(value)});
                } else {
                    setProduct({ ...product, price: Number(value)});
                }
            }                            
            return value;
        }                                        
        return prev;

    }

    const addProduct = async () => {
        try {                        
            const add = await addDoc(collection(db, "products"), { ...product, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
            onSubmit;
            setIsOpen(false);
            console.log("Produto adicionado com sucesso", product);
        } catch(e) {
            console.log("Erro ao adicionar o produto: " + e);
        }        
    }
    
    return(
        <View style = { styles.container }>
            <View style = { styles.background }>
                <MaterialCommunityIcons name = "close-thick" onPress={ () => setIsOpen(false)} color = "#6D0808" size = { 24 } style = { styles.closeIcon } />
                <Text style = { styles.title }>Novo Produto</Text>
                <Text style = { styles.hint }>Preencha as informações abaixo para adicionar um produto ao estoque.</Text>
                
                <View style = { styles.textInputContainer }>
                    <View style = {{ gap: 8, width: "70%" }}>
                        <Text style = { styles.titleTextInput }>Nome</Text>
                        <TextInput style = {{ ...styles.textInput }} value = { product?.name } onChangeText = { (value) => setProduct({ ...product, name: value }) } />
                    </View>                    
                    <View style = {{ gap: 8, width: "30%" }}>
                        <Text style = { styles.titleTextInput }>Quantidade</Text>
                        <TextInput 
                            style = { styles.textInput } 
                            value = { product?.amount?.toString() } 
                            onChangeText= { 
                                (value) => {
                                    if(!isNaN(Number(value))) {
                                        return setProduct(() => {
                                            if(!isNaN(Number(value))) 
                                                return { ...product, amount: Number(value) }
                                            return { ...product, amount: 0 }
                                        }); 
                                    }
                                    return;
                                }
                            } 
                            inputMode = "numeric" />
                    </View>                    
                </View>

                <View style = {{ ... styles.textInputContainer, marginVertical: 10 }}>
                    <View style = {{ gap: 8, width: "50%" }}>
                        <Text style = {{ fontFamily: "Inter_700Bold", fontSize: 10, marginLeft: 15 }}>Custo Unitário</Text>
                        <TextInput 
                            style = {{ ...styles.textInput }} 
                            value = { costString }
                            onChangeText= { (value) => setCostString((prev) => formatDecimal(value, prev, "cost")) }
                            inputMode = "decimal" 
                        />
                    </View>                     
                    <View style = {{ gap: 8, width: "50%" }}>
                        <Text style = {{ fontFamily: "Inter_700Bold", fontSize: 10, marginLeft: 15 }}>Preço Unitário</Text>
                        <TextInput 
                            style = {{ ...styles.textInput }}
                            value = { priceString }
                            onChangeText = { (value) => setPriceString((prev => formatDecimal(value, prev, "price"))) } 
                            inputMode = "decimal" 
                        />
                    </View> 
                </View>

                <View style = { styles.textInputContainer }>
                    <View style = {{ gap: 8, width: "101%" }}>
                        <Text style = {{ fontFamily: "Inter_700Bold", fontSize: 10, marginLeft: 15 }}>Descrição</Text>
                        <TextInput 
                            style = {{ ...styles.textInput, height: 80 }} 
                            multiline = { true }
                            value = { product?.description || "" }
                            onChangeText = { (value) => setProduct({ ...product, description: value }) }
                        />
                    </View> 
                </View>
                
                <TouchableOpacity style = { styles.button } onPress={ () =>  addProduct() }>
                    <Text style = { styles.buttonText }>Adicionar</Text>
                </TouchableOpacity>
            </View>            
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
        width: "90%", 
        gap: 9, 
        alignItems: "center", 
        justifyContent: "center"
    },

    titleTextInput: {
        fontFamily: "Inter_700Bold", 
        fontSize: 10, 
        marginLeft: 15
    },

    textInput: {
        backgroundColor: "#E9E9E9", 
        height: 35, 
        borderRadius: 3, 
        paddingHorizontal: 13
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