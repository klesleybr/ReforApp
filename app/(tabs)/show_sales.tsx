import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, ScrollView, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { getDoc, increment, onSnapshot, query, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import Header from "@/components/header";
import { useEffect, useState } from "react";
import Entypo from '@expo/vector-icons/Entypo';
import { getDocs, collection, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavProps } from "../_layout";
import { Dropdown } from "react-native-element-dropdown";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Confirmation from "@/components/confirmation";
import { TextInput } from "react-native-gesture-handler";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export type SaleData = {
    id: string,
    products: {
        id: string,
        name: string,
        amount: number,
        partialTotal: number,
        unitPrice: number
    }[],
    customerName: string,
    totalValue: number,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    isPaid: boolean,
    paymentMethod: string,
}

export default function ShowSalesScreen() {

    const navigation = useNavigation<DrawerNavProps>();
    const [expandItem, setExpandItem] = useState<SaleData | undefined>(undefined);
    const [salesData, setSalesData] = useState<SaleData[] | undefined>(undefined);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [customerValue, setCustomerValue] = useState("");
    const decimalStyle = Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

    useEffect(() => {        
        const unsub = onSnapshot(query(collection(db, "sales")), (querySnapshot) => {
            if(querySnapshot.empty)
                setSalesData([]);

            const sales = querySnapshot.docs;            
            setSalesData(sales.map(e => {
                    const productsList : any[] = e.get("products");
                    var total = 0;
                    productsList.forEach(e => {
                        total = total + (e.amount * e.unitPrice);
                    });

                    return {
                        id: e.id,
                        products: productsList.map((e) => {
                            return {
                                id: e.id as string,
                                name: e.name as string,
                                amount: e.amount as number,
                                unitPrice: e.unitPrice as number,
                                partialTotal: (e.amount * e.unitPrice) as number
                            };
                        }),
                        customerName: e.get("customerName"),
                        totalValue: total,
                        createdAt: e.get("createdAt"),
                        updatedAt: e.get("updatedAt"),
                        isPaid: e.get("isPaid"),
                        paymentMethod: e.get("paymentMethod")
                    }
                }).sort((a, b) => {
                    if(a.createdAt > b.createdAt) return -1;
                    if(a.createdAt < b.createdAt) return 1;
                    return 0;
                })
            );
        });

        return () => unsub();
    }, []);    
    
    return (
        <SafeAreaProvider>
            <SafeAreaView style = { styles.container }>
                <Header iconType="arrow-back"/>
                    <PaymentModal id = { expandItem?.id } visible = { showPaymentModal } onClose={ () => setShowPaymentModal(false) }/> 
                    <Confirmation 
                        visible = { showConfirmationModal } 
                        title = "Confirme a exclusão" 
                        description = "A exclusão da venda é uma ação irreversível. Você deseja prosseguir com a ação?"
                        onClose = { () => setShowConfirmationModal(false) }
                        onConfirmation = { async() => {
                            await deleteDoc(doc(db, "sales", expandItem!.id))                             
                        }}                        
                        checkboxLabel = "Desconsiderar esta venda na contagem de produtos."
                        checkbox = {true}
                        onConfirmationWithChekboxTrue={ async() => {
                            const saleRef = doc(db, "sales", expandItem!.id);
                            expandItem?.products.forEach(async e => {
                                const productRef = doc(db, "products", e.id);
                                const productSnap = await getDoc(productRef);
                                if(!productSnap.exists)
                                    return;
                                const sold = productSnap.get("sold") as number;                                
                                if(sold !== 0) {
                                    await updateDoc(productRef, {
                                        sold: sold - e.amount <= 0 ? 0 : sold - e.amount,
                                        updatedAt: serverTimestamp()
                                    });
                                }                                                                
                            });
                            await deleteDoc(saleRef);                            
                        }}
                    />
                    {
                        salesData === undefined ? (
                            <View style = { styles.loadingContainer }>
                                <ActivityIndicator size = { 40 } color = "#6D0808"/>
                                <Text style = { styles.loadingText }>Carregando vendas...</Text>
                            </View>
                        ) : salesData.length > 0 ? (
                            <View style = {{ flex: 1, width: "90%" }}>
                                <View style = { styles.searchContainer }>
                                    <FontAwesome name = "search" size = { 15 } style = {{ opacity: 0.2 }}/>
                                    <TextInput 
                                        style = { styles.searchInput }
                                        placeholder = "Pesquise por um cliente..."
                                        numberOfLines = {1}    
                                        value = { customerValue }
                                        onChangeText = { value => setCustomerValue(value) }                                
                                    />
                                </View>
                                <FlatList                                  
                                    showsVerticalScrollIndicator = { false }
                                    style = {{ flex: 1 }}                                      
                                    keyExtractor={ item => item.id }                    
                                    data = { customerValue === "" ? salesData : salesData.filter(e => (e.customerName.toLocaleLowerCase()).includes(customerValue.toLocaleLowerCase())) }
                                    renderItem={ ({ item }) => {                            
                                            return(
                                                <View style = { styles.itemContainer }>                                          
                                                        <View style = {{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                                            <View>
                                                                <Text style = { styles.itemDate }>
                                                                    { item.createdAt.toDate().toLocaleString("pt-BR", 
                                                                        { day:"2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) }
                                                                </Text>
                                                                <View style = { styles.itemInfoContainer }>
                                                                    <Text style = { styles.itemInfoText }><Text style = {{ fontFamily: "Inter_700Bold" }}>Cliente: </Text>{ item.customerName }</Text>
                                                                    <Text style = { styles.itemInfoText }><Text style = {{ fontFamily: "Inter_700Bold" }}>Total: </Text>{ decimalStyle.format(item.totalValue) }</Text>
                                                                    <Text style = {{ ...styles.itemInfoText, color: item.isPaid ? "#0A6D06" : "#770E0E" }}>
                                                                        <Text style = {{ fontFamily: "Inter_700Bold", color: "#000000" }}>Status: </Text>{ item.isPaid ? "pago" : "não pago" }
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <TouchableOpacity onPress={ () => setExpandItem(() => {
                                                                if(expandItem !== undefined && expandItem !== item)                                                        
                                                                    return item;
                                                                if(expandItem === item)
                                                                    return undefined;
                                                                return item;                                                    
                                                            }) }>
                                                                <Entypo name = { expandItem === item ? "triangle-up" : "triangle-down" }/>
                                                            </TouchableOpacity>
                                                        </View>
                                                        
                                                        {
                                                            expandItem === item ? (
                                                                <View style = { styles.listItemsContainer }>
                                                                    <View>
                                                                        <Text style = {{ ...styles.listItemsText, fontFamily: "Inter_700Bold" }}>Itens:</Text>
                                                                        <View style = {{ marginLeft: 10, marginBottom: 14 }}>
                                                                            {
                                                                                item.products.map(e => {
                                                                                    return(
                                                                                        <Text style = { styles.listItemsText } key={ e.id }>
                                                                                            { `${e.amount} ${e.name} (${decimalStyle.format(e.unitPrice)}/un) = ${decimalStyle.format(e.partialTotal)}` }
                                                                                        </Text>
                                                                                    );
                                                                                })
                                                                            }                                                               
                                                                        </View>
                                                                        <Text style = { styles.listItemsText }>
                                                                            <Text style = {{ fontFamily: "Inter_700Bold" }}>Forma de pagamento: </Text>{ item.paymentMethod }
                                                                        </Text>
                                                                        <View style = { styles.buttonContainer }>
                                                                            {
                                                                                !item.isPaid ? (
                                                                                    <TouchableOpacity 
                                                                                        style = {{ ...styles.button, backgroundColor: "#0A6D06"}}
                                                                                        onPress={ () => setShowPaymentModal(true) }
                                                                                    >
                                                                                        <Text style = { styles.buttonText }>Marcar como Pago</Text>                                                                    
                                                                                    </TouchableOpacity>
                                                                                ) : null
                                                                            }
                                                                            <TouchableOpacity 
                                                                                style = {{ ...styles.button, backgroundColor: "#770E0E"}}
                                                                                onPress={ () => setShowConfirmationModal(true)}
                                                                            >
                                                                                <Text style = { styles.buttonText }>Excluir Venda</Text>                                                                    
                                                                            </TouchableOpacity>
                                                                        </View>                                                
                                                                    </View>
                                                                </View>
                                                            ) : null
                                                        }                                                                               
                                                </View>
                                            )
                                        }
                                    }
                                />
                            </View>
                        ) : (
                            <View style = {{ justifyContent: "center", alignItems: "center", flex: 1, paddingHorizontal: "9%" }}>
                                <Text style = {{ fontFamily: "Inter_700Bold", fontSize: 22, textAlign: "center" }}>Nenhuma venda foi encontrada...</Text>
                                <Text style = {{ fontFamily: "Inter_400Regular", fontSize: 14, opacity: 0.5, textAlign: "center", marginTop: 10, marginBottom: 25 }}>
                                    Aperte o botão para registrar vendas.
                                </Text>
                                <TouchableOpacity 
                                    style = {{ backgroundColor: "#0E9608", paddingVertical: 8, paddingHorizontal: 10, borderRadius: 5, width: "90%" }} 
                                    onPress = { () => navigation.navigate("Sales") }
                                    >
                                    <Text style = {{ color: "#FFFFFF", fontFamily: "Inter_700Bold", textAlign: "center", fontSize: 16 }}>Ir para Vendas</Text>
                                </TouchableOpacity>
                            </View>                            
                        )
                    }
            </SafeAreaView>
        </SafeAreaProvider>
    );

}

function PaymentModal({ id, visible, onClose } : { id?: string, visible : boolean, onClose: () => void }) {

    const [paymentMethod, setPaymentMethod] = useState<undefined | string>(undefined);
    const paymentMethodList = [                
        { label: "Dinheiro", value: "Dinheiro"},
        { label: "PIX", value: "PIX" },
        { label: "Outro", value: "Outro"}
    ];

    const updatePayment = async() => {
        if(paymentMethod === undefined || id === undefined)
            return;
        const docRef = doc(db, "sales", id);
        await updateDoc(docRef, {
            paymentMethod: paymentMethod,
            isPaid: true,
            updatedAt: serverTimestamp()
        });
    };

    return(
        visible ? (
            <Modal transparent = { true }>
                <View style = { paymentModalStyles.container }>
                    <View style = { paymentModalStyles.background }>
                        <MaterialCommunityIcons name = "close-thick" onPress={ () => onClose() } color = "#6D0808" size = { 24 } style = { paymentModalStyles.closeIcon } />
                        <Text style = { paymentModalStyles.title }>Método de pagamento</Text>
                        <Text style = {{ fontFamily: "Inter_400Regular", textAlign: "center", opacity: 0.5, marginVertical: 20 }}>Informe o método de pagamento utilizado nesta venda.</Text>
                        <Dropdown 
                            data = { paymentMethodList }
                            labelField = { "label" }
                            valueField = { "value" }
                            onChange={ (item) => setPaymentMethod(item.value) }
                            placeholder = "Método de pagamento..."
                            placeholderStyle = { paymentModalStyles.dropdownText }
                            itemTextStyle = { paymentModalStyles.dropdownText }
                            selectedTextStyle = { paymentModalStyles.dropdownText } 
                            style = { paymentModalStyles.dropdown }                           
                        />
                        <TouchableOpacity 
                        onPress = { () => {
                            updatePayment();
                            onClose();
                        }}
                            style = { paymentModalStyles.button }
                        >
                            <Text style = { paymentModalStyles.buttonText }>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        ) : null
    );

}

const styles = StyleSheet.create({

    container: {        
        alignItems: "center",
        flex: 1,
    },
    loadingContainer: {
        flex: 1,        
        alignItems: "center",
        justifyContent: "center",
        gap: 20
    },
    loadingText: {
        fontFamily: "Inter_400Regular",
        fontSize: 15,
        opacity: 0.5
    },
    searchContainer: {
        flexDirection: "row",
        marginVertical: 30,
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        height: 42,
        borderRadius: 3,
        paddingLeft: 13
    },
    searchInput: {
        backgroundColor: "transparent",        
        paddingHorizontal: 13,
        fontFamily: "Inter_400Regular"
    },
    scrollViewContainer: {
        width: "90%",
        paddingTop: 30
    },
    itemContainer: {
        
        backgroundColor: "#FFFFFF",
        marginBottom: 6,
        paddingTop: 11,
        paddingBottom: 20,
        paddingHorizontal: 20,        
        justifyContent: "space-between",
        borderRadius: 7,
        boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.25)"
    },
    itemDate: {
        fontFamily: "Inter_700Bold",
        fontSize: 20
    },
    itemInfoContainer: {
        marginLeft: 21,
        marginTop: 2,
    },
    itemInfoText: {
        fontFamily: "Inter_400Regular"
    },
    listItemsContainer: {
        borderTopWidth: 1,
        marginTop: 13,
        paddingTop: 15,
    },
    listItemsText: {
        fontFamily: "Inter_400Regular",
        opacity: 0.5,
    },
    button: {
        width: "77%",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    buttonContainer: {
        gap: 4,
        marginTop: 18
    },
    buttonText: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        color: "#FFFFFF",
        textAlign: "center",
        paddingVertical: 8
    },

});
const paymentModalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignItems: "center",
        justifyContent: "center"     
    },
    background: {
        backgroundColor: "#FFFFFF",
        width: "90%",
        paddingHorizontal: "5%",
        paddingVertical: 60,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontFamily: "Inter_700Bold",
        fontSize: 22,
        textAlign: "center",        
    },
    closeIcon: {
        position: "absolute",
        top: 16,
        right: 16
    },
    dropdown: {    
        width: "80%",
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginBottom: 25
    },
    dropdownText: {
        fontFamily: "Inter_400Regular",
        fontSize: 15
    },
    button: {
        height: 40,
        width: "80%",
        backgroundColor: "#0E9608",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        alignSelf: "center"
    },
    buttonText: {
        fontFamily: "Inter_700Bold",
        fontSize: 15,
        textAlign: "center",
        color: "#FFFFFF"
    },

});