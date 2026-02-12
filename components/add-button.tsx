import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
    onPress: () => void,
    title: string,
}

export default function AddButton({ onPress, title } : Props) {

    return(
        <TouchableOpacity onPress={ onPress } style = { styles.button }>
            <Text style = { styles.buttonText }>{ title }</Text>
        </TouchableOpacity>
    );

}

const styles = StyleSheet.create({

    button: {
        backgroundColor: "#0E9608",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        paddingHorizontal: "10%"
    },
    
    buttonText: {
        color: "#FFFFFF",
        fontFamily: "Inter_700Bold",
        fontSize: 22
    }

});