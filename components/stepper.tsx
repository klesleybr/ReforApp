import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";

type Props = {
    value: number,
    stopIncrementValue?: number,
    onPressRight?: (value? : number) => void;
    onPressLeft?: (value? : number) => void;
}

export default function Stepper({ value, onPressLeft, onPressRight, stopIncrementValue } : Props) {

    const [digit, setDigit] = useState<number>(value);

    const increment = () => {
        if(stopIncrementValue !== undefined && digit >= stopIncrementValue)
            return;
        if(onPressRight !== undefined)
            onPressRight();
        setDigit((prev) => prev + 1);
    }

    const decrement = () => {
        if(digit === 0)
            return;
        if(onPressLeft !== undefined)
            onPressLeft();
        setDigit((prev) => prev - 1);
    }

    return(
        <View style = { styles.container }>
            <TouchableOpacity 
                onPress={ () => decrement() } 
                style = { [{ borderRightWidth: 1, borderRightColor: "rgba(0, 0, 0, 0.2)" }, styles.button] }>
                    <Text style = { styles.textButton }>-</Text>
            </TouchableOpacity>

            <Text style = { styles.number }>{ digit }</Text>
            
            <TouchableOpacity 
                onPress = { () => increment() } 
                style = { [{ borderLeftWidth: 1, borderLeftColor: "rgba(0, 0, 0, 0.2)" }, styles.button] }>
                    <Text style = { styles.textButton }>+</Text>
            </TouchableOpacity>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderWidth: 2,
        borderRadius: 5,
        alignItems: "center",
        height: 40
    },
    button: {
        width: 20,
        justifyContent: "center",
        alignItems: "center",
        
    },
    textButton: {
        fontFamily: "Inter_700Bold",
        fontSize: 25,
    },
    number: {
        width: 25,
        textAlign: "center",
    }
});