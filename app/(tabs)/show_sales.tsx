import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, ScrollView, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Timestamp } from "firebase/firestore";
import Header from "@/components/header";
import { useEffect, useState } from "react";
import Entypo from '@expo/vector-icons/Entypo';
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

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

const mockedSales : SaleData[] = [

    {
        id: "kdjsjfefoefefe",
        products: [
            {
                id: "kjowdkwk2e4",
                name: "Bolo de morango",
                amount: 3,
                partialTotal: 12,
                unitPrice: 4
            },
            {
                id: "902dkfifeksff",
                name: "Chocolate quente",
                amount: 2,
                partialTotal: 14,
                unitPrice: 7
            },
        ],
        customerName: "Caio Fábio",
        totalValue: 26,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        isPaid: false,
        paymentMethod: "outro"
    },
    {
        id:"jdjdsjdjsldejfeif",
        products: [
            {
                id: "9kdfj30fjjdf",
                name: "Coca-cola (2L)",
                amount: 1,
                partialTotal: 10,
                unitPrice: 10
            },
            {
                id: "ddfsoas02e92",
                name: "Suco de laranja",
                amount: 4,
                partialTotal: 20,
                unitPrice: 5
            }
        ],
        customerName: "Larissa Melo",
        totalValue: 30,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        isPaid: true,
        paymentMethod: "PIX"
    }

]

export default function ShowSalesScreen() {
        
    const [expandId, setExpandId] = useState<string | undefined>(undefined);
    const [salesData, setSalesData] = useState<SaleData[]>([]);
    const decimalStyle = Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

    const initialQuery = async() => {
        const querySnapshot = await getDocs(collection(db, "sales"));
        if(querySnapshot.empty) 
            return;

        setSalesData(querySnapshot.docs.map(e => {
                const listProducts : any[] = e.get("products");
                var total : number = 0;

                listProducts.forEach((e) => {
                    total = total + (e.amount * e.unitPrice);
                });

                return {
                    id: e.id,
                    products: listProducts.map((e) => {
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
                };
            }).sort((a, b) => {
                if(a.createdAt > b.createdAt) return -1;
                if(a.createdAt < b.createdAt) return 1;
                return 0;
            })
        );
    };

    useEffect(() => {
        initialQuery();
    }, []);
    
    return (
        <SafeAreaProvider>
            <SafeAreaView style = { styles.container }>
                <Header iconType="arrow-back"/>               
                    <View style = {{ flex: 1, width: "90%" }}>
                    <FlatList  
                        showsVerticalScrollIndicator = { false }
                        style = {{ paddingVertical: 30, flex: 1 }}                      
                        data = { salesData }
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
                                                <TouchableOpacity onPress={ () => setExpandId((prev) => {
                                                    if(expandId !== undefined && expandId !== item.id)                                                        
                                                        return item.id;
                                                    if(expandId === item.id)
                                                        return undefined;
                                                    return item.id;                                                    
                                                }) }>
                                                    <Entypo name = { expandId === item.id ? "triangle-up" : "triangle-down" }/>
                                                </TouchableOpacity>
                                            </View>
                                            
                                            {
                                                expandId === item.id ? (
                                                    <View style = { styles.listItemsContainer }>
                                                        <View>
                                                            <Text style = {{ ...styles.listItemsText, fontFamily: "Inter_700Bold" }}>Itens:</Text>
                                                            <View style = {{ marginLeft: 10, marginBottom: 14 }}>
                                                                {
                                                                    item.products.map(e => {
                                                                        return(
                                                                            <Text style = { styles.listItemsText }>
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
                                                                        <TouchableOpacity style = {{ ...styles.button, backgroundColor: "#0A6D06"}}>
                                                                            <Text style = { styles.buttonText }>Marcar como Pago</Text>                                                                    
                                                                        </TouchableOpacity>
                                                                    ) : null
                                                                }
                                                                <TouchableOpacity style = {{ ...styles.button, backgroundColor: "#770E0E"}}>
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
            </SafeAreaView>
        </SafeAreaProvider>
    );

}

const styles = StyleSheet.create({

    container: {        
        alignItems: "center",
        flex: 1
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