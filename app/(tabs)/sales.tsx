import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, ScrollView, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import Header from "@/components/header";
import { Timestamp } from "firebase/firestore";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Stepper from "@/components/stepper";

const products = [
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
]


export default function SalesScreen() {

    const selectImage = (category : string[] | undefined) => {
        if(category?.includes("Alimentos"))
            return require("@/assets/images/food-default.jpg");
        if(category?.includes("Bebidas"))
            return require("@/assets/images/drink-default.jpg");
        return require("@/assets/images/eat-default.jpg");
    }

    return(
        <SafeAreaProvider>
            <SafeAreaView style = { styles.container }>
                <Header iconType="arrow-back"/>
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
                                                    { item.product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
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

                    <TouchableOpacity style = { styles.nextButton } onPress={ () => console.log(products)}>
                        <Text style = { styles.nextButtonTitle }>Avançar</Text>
                    </TouchableOpacity>
                </ScrollView>
                
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