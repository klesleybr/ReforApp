import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
    onPress: () => void
}

export default function AddButton({ onPress } : Props) {

    return(
        <TouchableOpacity onPress={ onPress } style = { styles.button }>
            <Text style = { styles.buttonText }>+</Text>
        </TouchableOpacity>
    );

}

const styles = StyleSheet.create({

    button: {
        backgroundColor: "#0E9608",
        width: 41,
        height: 41,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10
    },
    
    buttonText: {
        color: "#FFFFFF",
        fontFamily: "Inter_700Bold",
        fontSize: 28
    }

});