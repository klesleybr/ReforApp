import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, ScrollView, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import Header from "@/components/header";
import { Timestamp } from "firebase/firestore";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Stepper from "@/components/stepper";
import { useNavigation, useTheme } from "@react-navigation/native";
import { DrawerNavProps, StackNavigatorProps } from "../_layout";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { db } from "@/config/firebaseConfig";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";

const productsMock : any[] = [
    {
        product: {
            name: "Pastel de frango",
            description: "",
            categories: ["Alimentos", "Pastéis"],
            status: true,
            cost: 2,
            price: 3.75,
            amount: 100,
            sold: 10,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        },
        amount: 0,
    },
    {
        product: {
            name: "Bolo de morango",
            description: "Venda por fatia",
            categories: ["Alimentos", "Bolo"],
            status: true,
            cost: 3,
            price: 4.25,
            amount: 30,
            sold: 10,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        },
        amount: 0,
    },
    {
        product: {
            name: "Guaraná Antártica(Latinha)",
            description: undefined,
            categories: ["Bebidas", "Refrigerantes"],
            status: true,
            cost: 3,
            price: 5,
            amount: 50,
            sold: 50,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        },
        amount: 0,
    },
    {
        product: {
            name: "Água Mineral s/ Gás",
            description: undefined,
            categories: ["Bebidas", "Água"],
            status: false,
            cost: 2,
            price: 3.75,
            amount: 100,
            sold: 10,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        },
        amount: 0,
    },
    {
        product: {
            name: "Sorvete de Uva",
            description: undefined,
            categories: ["Gelados", "Sorvetes"],
            status: true,
            cost: 1,
            price: 2,
            amount: 20,
            sold: 8,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        },
        amount: 0,
    },
    {
        product: {
            name: "Açaí (copo)",
            description: undefined,
            categories: ["Gelados", "Sorvetes"],
            status: true,
            cost: 2,
            price: 3.25,
            amount: 11,
            sold: 2,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        },
        amount: 0,
    },
    {
        product: {
            name: "Cachorro Quente",
            description: undefined,
            categories: ["Alimentos", "Lanches"],
            status: true,
            cost: 3,
            price: 5.50,
            amount: 30,
            sold: 8,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        },
        amount: 0,
    },
]

type Sale = {

    product: {
        name: string,
        unitPrice: number,
        categories?: string[],
        amount: number,
        sold: number,
        status: boolean
    },
    amount: number

}


export default function SalesScreen() {

    const navigation = useNavigation<DrawerNavProps>();
    const { colors } = useTheme();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<Sale[]>([]);

    const orderFunction = (list : Sale[]) => {        
       return list.sort(function(a, b) {
            return a.product.name.localeCompare(b.product.name);
       });
    };

    const initialQuery = async () => {
        const querySnapshot = await getDocs(collection(db, "products"));
        const storeProducts : Sale[] = [];
        querySnapshot.forEach((e) => {            
           storeProducts.push({
                product: {
                    name: e.get("name"),
                    unitPrice: e.get("unitPrice"),
                    amount: e.get("amount"),
                    sold: e.get("sold"),
                    categories: e.get("categories"),
                    status: e.get("status")
                },
                amount: 0
           });
        });
        setProducts(orderFunction(storeProducts));
        console.log(querySnapshot);
        console.log(storeProducts);
        console.log(products);
    }

    const selectImage = (category : string[] | undefined) => {
        if(category?.includes("Alimentos"))
            return require("@/assets/images/food-default.jpg");
        if(category?.includes("Bebidas"))
            return require("@/assets/images/drink-default.jpg");
        if(category?.includes("Gelados"))
            return require("@/assets/images/ice-cream-default.jpg")
        return require("@/assets/images/eat-default.jpg");
    }

    const toDetails = () => {
        const finalList = products.filter(e => e.amount > 0);
        if(finalList.length > 0)
            navigation.navigate("SaleDetails", { products: finalList });
    };

    useEffect(() => {
        setIsLoading(true);
        initialQuery();        
        setIsLoading(false);
    }, []);

    return(
        <SafeAreaProvider>
            <SafeAreaView style = {{ ...styles.container, backgroundColor: colors.background }}>
                <Header iconType="arrow-back"/>
                {
                    isLoading ? (
                        <View style = { styles.loadingContainer }>
                            <ActivityIndicator size = { 40 } color = "#6D0808"/>
                            <Text style = { styles.loadingText }>Carregando dados...</Text>
                        </View>
                    ) : products.length > 0 ? (
                        <ScrollView style = { styles.scrollContainer } contentContainerStyle = { styles.scrollContentContainer } showsVerticalScrollIndicator = { false }>
                            <Text style = { styles.hint }>Selecione os produtos que desejas adicionar à venda. Basta indicar a quantidade desejada.</Text>
                            <Text style = { styles.title }>Todos os Produtos</Text>
                            <FlatList
                                style = { styles.flatListContainer }
                                data = { products }
                                renderItem = { ({item}) => {
                                    return(
                                        <View style = { styles.itemContainer }>
                                            <View style = { styles.item }>
                                                <Image source={ selectImage(item.product.categories) } style = { styles.productImage }/>
                                                <View style = { styles.productInfo }>
                                                    <Text style = {{ ...styles.itemTitle, }} numberOfLines = { 2 } >{ item.product.name }</Text>
                                                    <View style = { styles.priceContainer }>
                                                        <Text style = {{ ...styles.itemTitle, fontSize: 15 }}>Preço:</Text>
                                                        <Text style = {{ ...styles.text, fontSize: 15}}>
                                                            { item.product.unitPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                        </Text>
                                                    </View>                                            
                                                </View>                                        
                                            </View>

                                            <View>
                                                {
                                                    item.product.status === false ? (
                                                        <Text style = { styles.productOff }>Produto desativado</Text>                                                
                                                    ) : item.product.amount <= item.product.sold ? (
                                                        <Text style = { styles.productOff }>Produto indisponível</Text>
                                                    ) : (
                                                        <Stepper 
                                                            value = { item.amount } 
                                                            onPressLeft = { () => { item.amount = item.amount - 1; console.log(item.amount) }}
                                                            onPressRight= { () => {item.amount = item.amount + 1; console.log(item.amount) }}
                                                        />
                                                    )
                                                }
                                            </View>                                    
                                        </View>
                                    );
                                } }
                            />

                            <TouchableOpacity style = { styles.nextButton } onPress={ () => toDetails() }>
                                <Text style = { styles.nextButtonTitle }>Avançar</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    ) : (
                        <View style = {{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: "9%" }}>
                            <View style = {{ gap: 10, marginBottom: 25 }}>
                                <Text style = {{ fontFamily: "Inter_700Bold", fontSize: 22, textAlign: "center" }}>
                                    Nenhum produto foi encontrado...
                                </Text>
                                <Text style = {{ fontFamily: "Inter_400Regular", fontSize: 14, opacity: 0.5, textAlign: "center" }}>
                                    Parece que nenhum produto foi registrado. Aperte o botão abaixo para conferir o estoque.
                                </Text>                                
                            </View>
                            <TouchableOpacity 
                                style = {{ backgroundColor: "#6D0808", paddingVertical: 8, borderRadius: 5, width: "90%" }} 
                                onPress={ () => navigation.navigate("Stock")}
                            >
                                <Text style = {{ color: "#FFFFFF", fontFamily: "Inter_700Bold", textAlign: "center", fontSize: 16 }}>
                                    Ir para o Estoque
                                </Text>
                            </TouchableOpacity>
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
        justifyContent: "center"
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
    scrollContainer: {
        width: "90%",
        marginTop: 56,
        marginBottom: 20
    },
    scrollContentContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    hint: {
        opacity: 0.5,
        fontFamily: "Inter_400Regular",
        fontSize: 12,
        textAlign: "center",
    },
    title: {
        fontFamily: "Inter_700Bold",
        fontSize: 22,
        textAlign: "center",
        marginTop: 34,
        marginBottom: 23
    },
    flatListContainer: {
        width: "100%",
        
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        marginBottom: 6,
        shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
        borderRadius: 5,
        paddingVertical: 8,
        paddingLeft: 9,
        paddingRight: 16,
        height: 100
    },
    item: {
        width: "70%",
        flexDirection: "row",
        gap: 7,
    },
    productImage: {
        width: 65,
        height: 82,
        resizeMode: "cover",
        borderRadius: 3,
        
    },
    productInfo: {
        marginTop: 2,
        width: "50%"
    },
    itemTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 18,
    },
    text: {
        fontFamily: "Inter_400Regular",
        fontSize: 10
    },
    priceContainer: {
        flexDirection: "row",
        gap: 3
    },
    descriptionContainer: {
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        marginTop: 4,
    },
    productOff: {
        fontFamily: "Inter_400Regular",
        opacity: 0.5,
        fontSize: 12,
        width: 100,
        textAlign: "right"
    },
    nextButton: {
        backgroundColor: "#0E9608",
        width: "77%",
        borderRadius: 5,
        marginTop: 40,
    },
    nextButtonTitle: {
        fontFamily: "Inter_700Bold",
        color: "#FFFFFF",
        fontSize: 20,
        paddingVertical: 8,
        textAlign: "center"
        
    },

});