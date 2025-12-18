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

    if(value > 0) {
        return(
            <View style = { styles.container }>
                <View style = {{ ...styles.progress, backgroundColor: progressColor(), width: percentWidth, borderRadius: value === 100 ? 6 : undefined }}>
                    <Text style = { styles.text }>{ percent }</Text> 
                </View>
            </View>
        );
    }

    return;

}

const styles = StyleSheet.create({

    container: {
        width: "100%",
        backgroundColor: "#e7e7e7ff", 
        borderRadius: 6, 
        height: 18,              
    },

    progress: {
        height: "100%",
        alignItems: "center",
        justifyContent: "center",                
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
        paddingHorizontal: "10%",              
    },

    text: {
        fontSize: 13,
        fontFamily: "Inter_400Regular",
        color: "#FFFFFF",        
    }

});

