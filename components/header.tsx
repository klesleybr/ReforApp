import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme, useNavigation, DrawerActions } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Logo from "@/assets/images/horizontal-logo.svg";

type IconType = {
    iconType: "menu" | "arrow-back"
}

export default function Header({ iconType } : IconType) {

    const colors = useTheme().colors;
    const navigation = useNavigation();    

    return(
    <View style = { [{ backgroundColor: colors.primary }, styles.container] }>
            <Ionicons 
                name = { iconType } 
                color = "#FFFFFF"
                size = { 24 } 
                onPress = { () => {
                    if(iconType === "menu") {
                        return navigation.dispatch(DrawerActions.openDrawer());
                    } else {
                        return navigation.goBack();
                    }
                } } 
                style = { styles.button} 
            />                       
            <Logo/>
        </View>
    );

}

const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        top: 0,
        zIndex: 1
    },
    
    text: {
        color: "#FFFFFF",
        fontSize: 22
    },

    button: {
        position: "absolute",
        left: 0,
        marginLeft: "4%"
    }

});