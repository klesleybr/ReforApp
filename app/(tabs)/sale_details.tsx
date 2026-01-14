import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { DrawerNavProps, StackNavigatorProps } from "../_layout";
import { useTheme } from "@react-navigation/native";
import Header from "@/components/header";

const decimalStyle = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function SaleDetailsScreen({ route, navigation } : StackNavigatorProps) {
    
    const { colors } = useTheme();
    const { selectedProducts, totalValue } = route.params;    

    const selectImage = (category : string[] | undefined) => {
        if(category?.includes("Alimentos"))
            return require("@/assets/images/food-default.jpg");
        if(category?.includes("Bebidas"))
            return require("@/assets/images/drink-default.jpg");
        if(category?.includes("Gelados"))
            return require("@/assets/images/ice-cream-default.jpg")
        return require("@/assets/images/eat-default.jpg");
    };

    return(
        <SafeAreaProvider>
            <SafeAreaView style = {{ ...styles.container, backgroundColor: colors.background }}>
                <Header iconType="arrow-back"/>                
                {
                    route.params !== undefined ? ( 
                        <View style = { styles.summaryContainer }>
                            <Text style = { styles.title }>Detalhes da Venda</Text>
                            <View style = { styles.flatListContainer }>
                                <FlatList                                                                                                          
                                    style = { styles.flatList }
                                    data = { selectedProducts } 
                                    renderItem={ ({ item }) => (
                                        <View style = { styles.itemContainer }>
                                            <View style = { styles.item }>
                                                <Image source = { selectImage(item.product.categories) } style = { styles.imageItem } resizeMode="cover"/>
                                                <View style = { styles.itemInfo }>
                                                    <Text style = { styles.itemTitle } numberOfLines={1}>{ item.product.name }</Text>
                                                    <View style = { styles.itemSubtitleContainer }>
                                                        <Text style = {{ ...styles.itemSubtitle, fontFamily: "Inter_700Bold" }}>Preço:</Text>
                                                        <Text style = { styles.itemSubtitle }>{ decimalStyle.format(item.product.unitPrice) }</Text>
                                                    </View>
                                                    <View style = { styles.itemSubtitleContainer }>
                                                        <Text style = {{ ...styles.itemSubtitle, fontFamily: "Inter_700Bold" }}>Quantidade:</Text>
                                                        <Text style = { styles.itemSubtitle }>{ item.amount > 1 ? item.amount + " unidades" : item.amount + " unidade" }</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <Text style = { styles.total }>{ decimalStyle.format(item.amount * item.product.unitPrice) }</Text>                          
                                        </View>
                                ) } />
                            </View> 
                            <View style = { styles.sum }>
                                <Text style = {{ fontFamily: "Inter_700Bold", fontSize: 20 }}>Total:</Text>
                                <Text style = {{ fontFamily: "Inter_400Regular", fontSize: 20 }}>{ decimalStyle.format(totalValue) }</Text>
                            </View>

                            <Text style = { styles.hint }>Revise os pedidos e, então, avance para a seção de pagamentos.</Text>

                            <TouchableOpacity 
                                style = {{ ...styles.button, backgroundColor: "#0A6D06", marginBottom: 4, marginTop: 25 }}
                                onPress={ () => navigation.navigate("FinalizeSales", { selectedProducts, totalValue }) }
                            >
                                <Text style = { styles.buttonText }>Avançar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style = {{ ...styles.button, backgroundColor: "#770E0E"}}>
                                <Text style = { styles.buttonText }>Limpar Carrinho</Text>
                            </TouchableOpacity>
                        </View>                                                                                            
                    ) : null
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
    title: {
        fontFamily: "Inter_700Bold",
        fontSize: 22,
        textAlign: "center",        
        marginBottom: 30
    },
    summaryContainer: {
        height: "100%",
        width: "90%",
        justifyContent: "center",
        paddingBottom: 30     
    },
    flatListContainer: {        
        maxHeight: "100%",
        borderBottomWidth: 2,
        borderBlockColor: "rgba(0, 0, 0, 0.2)",
        paddingBottom: 46,        
    },
    flatList: {
        maxHeight: 350,
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: 5   
    },
    itemContainer: {
        flexDirection: "row",        
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.2)",
        paddingVertical: 8,
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 9,
        paddingRight: 15,
    },
    item: {
        flexDirection: "row"
    },
    imageItem: {
        width: 70,
        height: 70,
        borderRadius: 4,
    },
    itemInfo: {
        marginLeft: 7
    },
    itemTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 18,
        marginBottom: 4,
    },
    itemSubtitleContainer: {
        flexDirection: "row",
        gap: 3,
        marginLeft: 19
    },
    itemSubtitle: {
        fontSize: 12,
        opacity: 0.5
    },
    total: {
        fontFamily: "Inter_700Bold",
        fontSize: 15,
        color: "#770E0E"
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
    hint: {
        fontFamily: "Inter_400Regular",
        fontSize: 14,
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
        paddingVertical: 8
    }
});