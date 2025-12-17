import { View, StyleSheet, Text, DimensionValue } from "react-native";

declare type Props = { value : number, decimalDigits? : number, backgroundColor? : string }

export default function ProgressBar({ value, decimalDigits, backgroundColor} : Props) {
    
    const progressColor = () => {
        if(value > 60) {
            return "#0A6D06";
        } else if(value > 30) {
            return "#EAAC04";
        } else {
            return "#770E0E";
        }
    }

    const percentWidth : DimensionValue  = `${value}%`;
    const percent = value.toFixed(decimalDigits ? decimalDigits : 0) + "%";

    return(
        <View style = { styles.container }>
            <View style = {[styles.progress, { backgroundColor: progressColor(), borderColor: progressColor(), width: percentWidth, paddingHorizontal: percent !== "0%" ? "10%" : 0 }]}>
                {
                    percent !== "0%" ? <Text style = { styles.text }>{ percent }</Text> : null
                }
            </View>
        </View>
    );

}

const styles = StyleSheet.create({

    container: {
        width: "100%",
        backgroundColor: "#FFFFFF", 
        borderRadius: 3, 
        height: 18,
        borderWidth: 0.5,
        borderColor: "#000000"        
    },

    progress: {
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        //borderTopRightRadius: 3,
        //borderBottomRightRadius: 3,
        borderRadius: 3,
        //borderWidth: 0.5,        
    },

    text: {
        fontSize: 13,
        fontFamily: "Inter_400Regular",
        color: "#FFFFFF",
        
    }

});

