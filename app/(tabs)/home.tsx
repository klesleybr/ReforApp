import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, FlatList, ScrollView, Image } from "react-native";
import { useTheme } from "@react-navigation/native";
import Header from "@/components/header";
import { PieChart } from "react-native-gifted-charts";
import Entypo from '@expo/vector-icons/Entypo';
import ProgressBar from "@/components/progress-bar";


const goalData = [
    {
        description: "valor arrecadado",
        value: 4600
    }, 
    {
        description: "meta",
        value: 6000
    }
]

const saleData = [
    {
        name: "Coca-Cola (1L)",
        amount: 2,
        price: 9.25
    },
    {
        name: "Bolo de chocolate (fatia)",
        amount: 3,
        price: 7.5
    },
    {
        name: "Sanduíche natural",
        amount: 2,
        price: 6.25
    },
    {
        name: "Coca-Cola (1L)",
        amount: 1,
        price: 9.25
    },
    {
        name: "Pipoca salgada",
        amount: 6,
        price: 1.25
    },
]

const stockData = [
    {
        name: "Coca-Cola Lata (350 mL)",
        stock: 60,
        sold: 57
    },
    {
        name: "Fanta Uva (2L)",
        stock: 49,
        sold: 30
    },
    {
        name: "Pipoca Salgada",
        stock: 58,
        sold: 3
    }
]

const decimalStyle = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function HomeScreen() {
    
    const { colors } = useTheme();    

    const chartData = [
        {
            value: goalData[0].value,            
            color: "#4A1212",
            text: `${ (goalData[0].value / goalData[1].value * 100).toFixed(0) } %`         
        },
        {
            value: goalData[1].value -goalData[0].value,
            color: "#FFFFFF",            
            textBackground: "meta"
        }
    ];

    return(

        <SafeAreaProvider>
            <SafeAreaView style = { [styles.container, { backgroundColor: colors.background }] }>
                <Header iconType="menu"/>

                <ScrollView 
                    showsVerticalScrollIndicator = { false } 
                    contentContainerStyle = { styles.scrollViewContainer } 
                    style = {{ width: "100%" }}
                >
                    <View>
                        <View style = { styles.chartContainer }>
                            <PieChart 
                                data = { chartData }
                                donut 
                                showTooltip 
                                innerCircleColor = { colors.background }
                                textSize = { 22 }
                                font = "Inter_400Regular"
                                textBackgroundColor = "transparent"
                                innerRadius = { 90 }
                                paddingHorizontal = { 10 }
                                animationDuration = { 1000 }
                                isAnimated
                                labelLineConfig={{ length: 30 }}
                                tooltipDuration={ 1000 }                    
                                />
                            <Text style = { styles.chartTextBackground }>{ decimalStyle.format(goalData[0].value) }</Text>
                        </View>                    
                        <Text style = { [styles.hint, { textAlign: "right", marginTop: 17 }] }>{"Gráfico do batimento\nde metas"}</Text>
                    </View>

                    <View style = {{ width: "90%", marginTop: 24 }}>
                        <Text style = {{ ...styles.hint, fontSize: 18, marginLeft: 23 }}>Vendas do dia</Text>
                        <FlatList                         
                            showsVerticalScrollIndicator = { false }                                                 
                            data = { saleData } 
                            style = { styles.salesList }
                            renderItem={({ item }) => <Sale data = { item }/>}
                        />                                    
                    </View>

                    <View style = {{ width: "90%", marginTop: 24 }}>
                        <Text style = {{ ...styles.hint, fontSize: 18, marginLeft: 23 }}>Situação do estoque</Text>
                        <FlatList
                            showsVerticalScrollIndicator = { false }
                            data = { stockData }
                            style = {{ marginTop: 12 }}
                            renderItem = { ({ item }) => <StockAlert data = { item }/> }
                        />                
                    </View> 
                </ScrollView>                               
            </SafeAreaView>
        </SafeAreaProvider>

    );

}

function Sale({ data } : any) {

    return(
        <View style = { styles.saleItem }>
            <Entypo name = "triangle-right" style = {{ marginRight: 5 }}></Entypo>
            <Text style = {{ ...styles.saleItemText, width: "20%" }}>{ data.amount + " un." }</Text>
            <Text style = {{ ...styles.saleItemText, width: "80%", textAlign: "center", paddingHorizontal:"5%" }} numberOfLines={ 1 }>{ data.name }</Text>                                    
            <Text style = {{ ...styles.saleItemText, width: "25%", textAlign: "right" }}>{ decimalStyle.format(data.amount * data.price) }</Text>                                    
        </View>  
    );

}

function StockAlert({ data } : any) {

    const remains = data.stock - data.sold;
    const percentRemains = (remains / data.stock) * 100;

    const message = () => {
        if(remains > 1) {
            return "Restam " + remains + " unidades."
        } else if (remains > 0) {
            return "Resta 1 unidade."
        } else {
            return "O produto acabou."
        }
    }    

    return(
        <View style = { styles.stockAlertItem }>
            <Image source = { require("@/assets/images/food-default.jpg") } style = { styles.stockAlertImage }/>
            <View style = {{ width: "100%", paddingRight: 85 }}>
                <View style = {{ gap: 3, marginBottom: 3 }}>
                    <Text style = {{ fontSize: 18, fontFamily: "Inter_400Regular"}}>{ data.name }</Text>
                    <ProgressBar value = { percentRemains }/>                                    
                </View>                
                <Text style = {{ fontSize: 12, color: "#959595", fontFamily: "Inter_400Regular" }}>{ message() }</Text>               
            </View>
        </View>
    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",    
    },

    scrollViewContainer: { 
        alignItems: "center", 
        justifyContent: "center", 
        height: "100%", 
        marginVertical: 70 
    },

    chartContainer: {
        alignItems: "center",
        justifyContent: "center",        
    },

    chartTextBackground: {
        position: "absolute", 
        fontFamily: "Inter_700Bold", 
        fontSize: 24
    },

    hint: {
        fontSize: 15,
        color: "#95959595",
        fontFamily: "Inter_400Regular",
    },

    salesList: {
        marginTop: 12,
        height: 192,
        backgroundColor: "#D9D9D9",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 5,
    },

    saleItem: {
        flexDirection: "row",
        justifyContent: "space-between",  
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.5)",
        paddingVertical: 9,
        alignItems: "center"
    },

    saleItemText: {
        fontSize: 15,
        fontFamily: "Inter_400Regular",                         
    },

    stockAlertItem: { 
        backgroundColor: "#FFFFFF", 
        height: 72, 
        marginBottom: 7, 
        borderRadius: 5, 
        flexDirection: "row", 
        alignItems: "center"
    },

    stockAlertImage: {
        width: 65, 
        height: 65, 
        resizeMode: "cover", 
        borderRadius: 2, 
        marginLeft: 3, 
        marginRight: 6
    }

});

