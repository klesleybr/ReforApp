import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Checkbox } from "@futurejj/react-native-checkbox";
import { useState } from "react";
import { Modal, View, StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
    visible: boolean,
    title: string,
    description: string,
    onClose: () => void,
    onConfirmation: () => void,
    onNegation?: () => void,
    checkbox?: boolean,
    checkboxLabel?: string,
    onConfirmationWithChekboxTrue?: () => void
}

export default function Confirmation({ visible, title, description, onClose, onConfirmation, onNegation, checkbox = false, checkboxLabel, onConfirmationWithChekboxTrue } : Props) {
    const [status, setStatus] = useState(false);

    return(
        visible ? (
            <Modal transparent = { true }>
                <View style = { styles.container }>
                    <View style = { styles.background }>
                        <MaterialCommunityIcons name = "close-thick" onPress={ () => onClose() } color = "#6D0808" size = { 24 } style = { styles.closeIcon }/>
                        <Text style = { styles.title }>{ title }</Text>
                        <Text style = { styles.hint }>{ description }</Text>
                        {
                            checkbox ? (
                                <View style = { styles.chekboxContainer }>
                                    <Checkbox 
                                        status = { status ? "checked" : "unchecked" } 
                                        onPress={ () => setStatus(prev => !prev) } 
                                        color="#6D0808"  
                                        style = {{ top: 5 }}                                      
                                    />
                                    <Text style = { styles.checkboxLabel }>{ checkboxLabel }</Text>
                                </View>
                            ) : null
                        }
                        <View style = {{ flexDirection: "row", gap: 20 }}>
                            <TouchableOpacity
                                style = {{ ...styles.button, backgroundColor: "#6D0808" }}
                                onPress={ () => {
                                    if(status && onConfirmationWithChekboxTrue !== undefined) {
                                        onConfirmationWithChekboxTrue();
                                        onClose();
                                        setStatus(false);
                                    } else {
                                        onConfirmation();
                                        onClose();
                                        setStatus(false);
                                    }
                                }}
                            >
                                <Text style = { styles.buttonText }>Sim</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style = { styles.button }
                                onPress={ () => {
                                    if(onNegation !== undefined)
                                        onNegation();
                                    onClose();
                                    setStatus(false);
                                }}
                            >
                                <Text style = { styles.buttonText }>Não</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        ) : null
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignItems: "center",
        justifyContent: "center"     
    },
    background: {
        backgroundColor: "#FFFFFF",
        width: "90%",
        paddingHorizontal: "5%",
        paddingVertical: 60,
        justifyContent: "center",
        alignItems: "center"
    },
    closeIcon: {
        position: "absolute",
        top: 16,
        right: 16
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
    button: {
        height: 40,
        width: "40%",
        backgroundColor: "#0E9608",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,        
    },
    buttonText: {
        fontFamily: "Inter_700Bold",
        fontSize: 15,
        textAlign: "center",
        color: "#FFFFFF"
    },
    chekboxContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "baseline",          
        width: "90%",
        marginVertical: 20      
    },
    checkboxLabel: {
        fontFamily: "Inter_400Regular",        
    },
});