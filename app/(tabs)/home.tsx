import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { View, Text, StyleSheet, Button } from "react-native";

import { useTheme } from "@react-navigation/native";
import Header from "@/components/header";

import { PieChart } from "react-native-gifted-charts";


const data = [
    {
        description: "valor arrecadado",
        value: 4600
    }, 
    {
        description: "meta",
        value: 6000
    }
]


export default function HomeScreen() {

    const { colors } = useTheme();    

    const chartData = [
        {
            value: data[0].value,            
            color: "#4A1212",
            text: `${ (data[0].value / data[1].value * 100).toFixed(0) } %`         
        },
        {
            value: data[1].value -data[0].value,
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
                        <Text style = { styles.chartTextBackground }>{"R$ " + data[0].value.toLocaleString("pt-BR") }</Text>
                    </View>                    
                    <Text style = { [styles.hint, { textAlign: "right", marginTop: 17 }] }>{"Gráfico do batimento\nde metas"}</Text>
                </View>
                
            </SafeAreaView>
        </SafeAreaProvider>

    );

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
    }

});

