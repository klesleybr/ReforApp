import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { View, Text, StyleSheet, FlatList } from "react-native";

import { useTheme } from "@react-navigation/native";
import Header from "@/components/header";

import { PieChart } from "react-native-gifted-charts";

import Entypo from '@expo/vector-icons/Entypo';


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

const sellData = [
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

                <View>
                    <View style = { styles.chartContainer }>
                        <PieChart 
                            data={chartData}                                         
                            donut 
                            showTooltip 
                            innerCircleColor={colors.background}
                            textSize={22}
                            font="Inter_400Regular"
                            textBackgroundColor="transparent"
                            innerRadius={90}
                            paddingHorizontal={10}
                            animationDuration={1000}
                            isAnimated
                            labelLineConfig={{length: 30}}
                            tooltipDuration={1000}                    
                         />
                        <Text style = { styles.chartTextBackground }>{"R$ " + goalData[0].value.toLocaleString("pt-BR") }</Text>
                    </View>                    
                    <Text style = { [styles.hint, { textAlign: "right", marginTop: 17 }] }>{"Gráfico do batimento\nde metas"}</Text>
                </View>

                <View style = {{ width: "90%", marginTop: 24 }}>
                    <Text style = {[ styles.hint, { fontSize: 18, marginLeft: 23 }]}>Vendas do dia</Text>
                    <FlatList                         
                        showsVerticalScrollIndicator={ false }                                                 
                        data = { sellData } 
                        style = { styles.flatListContainer }
                        renderItem={({ item }) => {
                            return(                                
                                <View style = { styles.item }>
                                    <Entypo name = "triangle-right" style = {{ marginRight: 5 }}></Entypo>
                                    <Text style = { [styles.itemText, { width: "20%" }] }>{item.amount + " un."}</Text>
                                    <Text style = { [styles.itemText, { width: "80%", textAlign: "center", paddingHorizontal:"5%" }] } numberOfLines={1}>{item.name}</Text>                                    
                                    <Text style = { [styles.itemText, { width: "25%", textAlign: "right" }] }>{"R$ " + (item.amount * item.price).toFixed(2)}</Text>                                    
                                </View>                                    
                            );
                        }}
                    />                                    
                </View>                
            </SafeAreaView>
        </SafeAreaProvider>

    );

}

const displayText = (text : string) => {
    return text.length > 10 ? text.substring(0, 10) + "..." : text;
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",    
    },

    chartContainer: {
        alignItems: "center",
        justifyContent: "center"
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

    flatListContainer: {
        marginTop: 12,
        height: 192,
        backgroundColor: "#D9D9D9",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 5,
    },

    item: {
        flexDirection: "row",
        justifyContent: "space-between",  
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.5)",
        paddingVertical: 9,
        alignItems: "center"
    },

    itemText: {
        fontSize: 15,
        fontFamily: "Inter_400Regular",                         
    }

});

