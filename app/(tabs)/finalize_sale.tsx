import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import Header from "@/components/header";
import { useTheme } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import { Checkbox } from "@futurejj/react-native-checkbox";
import Success from "@/assets/images/success.svg";
import { StackNavigatorProps } from "../_layout";
import type { ProductSale } from "./sales";
import { db } from "@/config/firebaseConfig";
import { collection, addDoc, doc, updateDoc, increment, Timestamp, serverTimestamp  } from "firebase/firestore";

export default function FinalizeSaleScreen({ navigation, route } : StackNavigatorProps) {
    
    const { colors } = useTheme();
    const { selectedProducts, totalValue } = route.params;
    const paymentMethodList = [        
        { label: "Dinheiro", value: "Dinheiro" },        
        { label: "PIX", value: "PIX" },          
        { label: "Outro", value: "Outro"},        
    ];
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [isPaid, setIsPaid] = useState<boolean>(false);
    const [customerName, setCustomerName] = useState<string>("");
    const [isFinalized, setIsFinalized] = useState<boolean>(false);

    const incrementSold = async (id : string, amount : number) => {
        const docRef = doc(db, "products", id);
        await updateDoc(docRef, {
            sold: increment(amount)
        });
    };

    const submitSale = async () => {
        try {
            await addDoc(collection(db, "sales"), {
                products: selectedProducts.map((e : ProductSale) => {
                    return {
                        id: e.product.id,
                        name: e.product.name,
                        unitPrice: e.product.unitPrice,
                        amount: e.amount,                        
                    }
                }),                
                customerName: customerName.trim(),
                paymentMethod,
                isPaid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            selectedProducts.forEach((e : ProductSale) => {
                incrementSold(e.product.id, e.amount);
            });

            setIsFinalized(true);
        } catch(e) {
            console.log("Erro ao registrar venda:", e);
        }
    };


    return(
        <SafeAreaProvider>
            <SafeAreaView style = {{ ...styles.container, backgroundColor: colors.background }}>
                <Header iconType = { isFinalized ? undefined : "arrow-back" }/>
                {                    
                    !isFinalized ? (
                    <ScrollView 
                        style = { styles.scrollViewContainer } 
                        contentContainerStyle = { styles.scrollViewContentContainer }
                        showsVerticalScrollIndicator = { false }
                    >
                        <Text style = { styles.title }>Finalização da Venda</Text>
                        <View style = { styles.form }>
                            <View>
                                <Text style = { styles.label }>Nome do comprador <Text style = { styles.required }>*</Text></Text>
                                <TextInput style = { styles.textInput } value = { customerName } onChangeText = { (value) => setCustomerName(value) } />
                            </View>
                            <View style = {{ flexDirection: "row", justifyContent: "space-between" }}>
                                <View style = {{ width: "40%" }}>
                                    <Text style = { styles.label }>Telefone</Text>
                                    <TextInput style = { styles.textInput }/>
                                </View>
                                <View style = {{ width: "58%" }}>
                                    <Text style = { styles.label }>E-mail</Text>
                                    <TextInput style = { styles.textInput }/>
                                </View>
                            </View>
                            <View style = {{ flexDirection: "row", justifyContent: "space-between" }}>
                                <View style = {{ width: "53%" }}>
                                    <Text style = { styles.label }>Cidade</Text>
                                    <TextInput style = { styles.textInput }/>
                                </View>
                                <View style = {{ width: "45%" }}>
                                    <Text style = { styles.label } numberOfLines={1}>Forma de pagamento <Text style = { styles.required }>*</Text></Text>
                                    <Dropdown 
                                        data = { paymentMethodList } 
                                        value = { paymentMethod }
                                        labelField = "label"
                                        valueField = "value"                                   
                                        onChange = { (item) => {setPaymentMethod(item.value)} }                                    
                                        placeholder = "Selecione..."
                                        placeholderStyle = {{ opacity: 0.5 }}
                                        style = { styles.dropdown }                                
                                    />
                                </View>
                            </View>
                        </View>
                        <View style = { styles.sum }>
                            <Text style = {{ fontFamily: "Inter_700Bold", fontSize: 20 }}>Total:</Text>
                            <Text style = {{ fontFamily: "Inter_400Regular", fontSize: 20 }}>{ (totalValue).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }</Text>
                        </View>
                        {
                                paymentMethod !== "" && customerName !== "" ? (
                                    <View>
                                        <View style = { styles.paymentContainer }>
                                            <Checkbox 
                                                status = { isPaid ? "checked" : "unchecked" } 
                                                onPress = { () => setIsPaid(prev => !prev) } 
                                                style = { styles.checkbox }
                                                color="#0A6D06"
                                                size = { 18 }
                                            />
                                            <Text style = { styles.checkboxLabel}>
                                                Marque esta caixa para <Text style = {{ fontFamily: "Inter_700Bold" }}>confirmar o pagamento </Text> 
                                                { paymentMethod === "PIX" ? "via PIX." : paymentMethod === "Cartão de crédito" ? "com cartão de crédito." : 
                                                    paymentMethod === "Cartão de débito" ? "com cartão de débito." : paymentMethod === "Dinheiro" ? "com dinheiro." : 
                                                        "com outra forma." }
                                            </Text>
                                        </View>

                                        <TouchableOpacity 
                                            style = {{ ...styles.button, backgroundColor: "#0A6D06", marginBottom: 4, marginTop: 25 }}
                                            onPress={ () => submitSale() }
                                        >
                                            <Text style = { styles.buttonText }>Registrar Venda</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style = {{ ...styles.button, backgroundColor: "#770E0E"}}
                                            onPress = { () => navigation.popTo("Sales") }
                                        >
                                            <Text style = { styles.buttonText }>Cancelar Venda</Text>
                                        </TouchableOpacity>
                                    </View>
                                    
                                ) : (
                                    <Text style = { styles.hint }>Preencha os campos obrigatórios para avançar...</Text>
                                )
                        }
                    </ScrollView>) : (
                        <View style = { styles.finalizedContainer }>
                            <Success />
                            <View style = {{ gap: 9, marginVertical: 48 }}>
                                <Text style = {{ fontFamily: "Inter_700Bold", fontSize: 22, textAlign: "center" }}>
                                    Venda Registrada com Sucesso!
                                </Text>
                                <Text style = {{ fontFamily: "Inter_700Bold", fontSize: 16, color: isPaid ? "#0A6D06" : "#770E0E", textAlign: "center" }}>
                                    <Text style = {{ color: "#000000" }}>Status: </Text>{ isPaid ? "PAGO" : "NÃO PAGO" }
                                </Text>
                            </View>
                            <View>
                                <TouchableOpacity 
                                    style = {{ ...styles.button, backgroundColor: "#770E0E", marginBottom: 8 }}
                                    onPress={ () => navigation.popTo("Sales") }
                                >
                                    <Text style = { styles.buttonText }>Registrar outra Venda</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style = {{ ...styles.button, backgroundColor: "#770E0E"}}
                                    onPress = { () => navigation.popTo("Home") }
                                >
                                    <Text style = { styles.buttonText }>Ir para o início</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }
            </SafeAreaView>
        </SafeAreaProvider>
    );

}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        alignItems: "center",
    },
    scrollViewContainer: {
        width: "100%",        
    },
    scrollViewContentContainer: {
        height: "100%",
        paddingHorizontal: "7%",
        justifyContent: "center"

    },
    title: {
        fontFamily: "Inter_700Bold",
        fontSize: 22,
        textAlign: "center",
        marginBottom: 18,
    },
    label: {
        fontFamily: "Inter_700Bold", 
        fontSize: 12, 
        marginLeft: 15,
        marginBottom: 8,
    },
    required: {
        color: "#6D0808",
    },
    textInput: {
        backgroundColor: "#FFFFFF",
        borderRadius: 3,
        height: 35,
        paddingHorizontal: 13
    },
    form: {
        gap: 15,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.2)",
        paddingBottom: 38
    },
    dropdown: {
        backgroundColor: "#FFFFFF",
        height: 35,
        paddingHorizontal: 13,
        borderRadius: 3,        
       
    },
    sum: {
        width: "80%",
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 29,
        paddingVertical: 5,
        borderRadius: 5,
        marginVertical: 28,
        alignSelf: "center"
    }, 
    paymentContainer: {
        flexDirection: "row",        
        justifyContent: "center"
    },
    checkbox: {
        
    },
    checkboxLabel: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
        textAlign: "center",
        width: 240,
        marginTop: 5
    },
    hint: {
        fontFamily: "Inter_400Regular",
        opacity: 0.5,
        textAlign: "center"
    },
    button: {
        width: "77%",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    buttonText: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        color: "#FFFFFF",
        textAlign: "center",
        paddingVertical: 8,
        width: 300
    },
    finalizedContainer: {
        height: "90%",
        justifyContent: "center",
        alignItems: "center"
    },
});