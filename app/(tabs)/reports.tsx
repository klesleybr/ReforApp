import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import Header from "@/components/header";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { MaskedTextInput} from "react-native-mask-text";

export default function ReportScreen() {

    const {colors} = useTheme();
    const [initialDate, setInitialDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [value, setValue] = useState<number>(0);
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    return(
        <SafeAreaProvider>
            <SafeAreaView style = {{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
                <Header iconType="arrow-back"/>

                <View style = { styles.container }>
                    
                    <Text style = { styles.hint }>
                        Preencha os campos de data e pressione "Buscar" para consultar faturamento por período. <Text style = {{ fontFamily: "Inter_700Bold"}}>Caso algum dos campos
                        não seja preenchido, retorna o faturamento de hoje.</Text>
                    </Text>

                    <View style = {{ marginVertical: 60 }}>
                        {
                            isLoading ? (
                                <View style = {{ gap: 20 }}>
                                    <ActivityIndicator color = "#6D0808" size={ 40 } />
                                    <Text style = {{ ...styles.hint }}>Buscando dados...</Text>
                                </View>
                            ) : (
                                <Text style = { styles.value }>{ value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }</Text>
                            )
                        }
                    </View>

                    
                    
                    <View style = { styles.dateContainer }>
                        <View style = {{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                            <Text style = { styles.label }>Data Inicial:</Text>
                            <View style = { styles.textInputContainer }>
                                <Feather name = "calendar" size = { 20 } style = {{ opacity: 0.5 }}/>                   
                                <MaskedTextInput 
                                    keyboardType="numeric" 
                                    type="date" 
                                    mask="99/99/9999" 
                                    options={{ dateFormat: "DD/MM/YYYY" }} 
                                    value = { initialDate } 
                                    onChangeText={ (text) => setInitialDate(text) } 
                                    placeholder="DD/MM/AAAA"
                                    style = { styles.textInput }
                                />
                            </View>  
                        </View>

                        <View style = {{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                            <Text style = { styles.label }>Data Final:</Text>
                            <View style = { styles.textInputContainer }>
                                <Feather name = "calendar" size = { 20 } style = {{ opacity: 0.5 }}/>
                                <MaskedTextInput 
                                    keyboardType="numeric" 
                                    type="date" 
                                    mask="99/99/9999" 
                                    options={{ dateFormat: "DD/MM/YYYY" }} 
                                    value = { endDate } 
                                    onChangeText={ (text) => setEndDate(text)} 
                                    placeholder="DD/MM/AAAA"
                                    style = { styles.textInput }
                                />
                            </View>
                        </View>
                    </View>                        

                    <TouchableOpacity
                        onPress={ async () => {
                            setIsLoading(true);
                            if(initialDate === "" || endDate === "") {
                                const todayInit = new Date(Date.now());
                                todayInit.setUTCHours(0);
                                todayInit.setUTCMinutes(0);
                                todayInit.setUTCSeconds(0);
                                todayInit.setUTCMilliseconds(0)

                                const todayEnd = new Date(Date.now());

                                console.log(todayInit)
                                const q = query(collection(db, "sales"), where("createdAt", ">=", todayInit), where("createdAt", "<=", todayEnd))
                                const querySnapshot = await getDocs(q);                                
                                setIsLoading(false);
                                return;
                            }


                            const initialDateSplit = initialDate.split("/");
                            const endDateSplit = endDate.split("/");

                            const initialDateFormat = new Date(parseInt(initialDateSplit[2]), parseInt(initialDateSplit[1]) - 1, parseInt(initialDateSplit[0]));                        
                            const endDateFormat = new Date(parseInt(endDateSplit[2]), parseInt(endDateSplit[1]) - 1, parseInt(endDateSplit[0]));
                            endDateFormat.setUTCHours(23);
                            endDateFormat.setUTCMinutes(59);
                            endDateFormat.setUTCSeconds(59);
                            endDateFormat.setUTCMilliseconds(999);

                            const q = query(collection(db, "sales"), where("createdAt", ">=", initialDateFormat),
                                where("createdAt", "<=", endDateFormat));
                            const querySnapshot = await getDocs(q);

                            let total = 0;
                            querySnapshot.forEach(doc => {
                                const products = doc.get("products") as any[];
                                products.forEach(p => { total = total + (p.amount * p.unitPrice) })
                            });  

                            setValue(total);
                            setIsLoading(false);
                        }}
                        style = { styles.buton }
                    >
                        <Text style = { styles.buttonText }>Consultar</Text>
                    </TouchableOpacity>

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
        width: "90%"
    },
    hint: {
        fontFamily: "Inter_400Regular",
        fontSize: 12,
        opacity: 0.5,               
        textAlign: "center",
    },
    dateContainer: {
        width: "100%",
        alignItems: "center",
        gap: 10,
        marginBottom: 30
    },
    label: {
        fontFamily: "Inter_700Bold",
        fontSize: 11,
        width: 40       
    },
    textInputContainer: {
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "52%",
        borderRadius: 5,
        gap: 15
    },
    textInput: {
        fontFamily: "Inter_400Regular",
        width: "60%",
        height: 42
    },
    value: {
        fontFamily: "Inter_700Bold",
        color: "#0A6D06",        
        fontSize: 40
    },
    buton: {
        backgroundColor: "#6D0808",
        paddingVertical: 8,
        paddingHorizontal: "3%",
        borderRadius: 5
    },
    buttonText: {
        fontFamily: "Inter_700Bold",
        color: "#FFFFFF"
    }

});