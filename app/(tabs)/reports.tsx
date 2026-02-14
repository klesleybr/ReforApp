import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import Header from "@/components/header";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { MaskedTextInput} from "react-native-mask-text";
import { Checkbox } from "@futurejj/react-native-checkbox";

export default function ReportScreen() {

    const {colors} = useTheme();
    const [initialDate, setInitialDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [value, setValue] = useState<number>(0);
    const [isPaidOnly, setIsPaidOnly] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [salesData, setSalesData] = useState<any[] | undefined>(undefined);

    const setTotal = () => {

        let total = 0;

        salesData?.forEach(doc => {            
            if(isPaidOnly && !doc.get("isPaid"))
                return;
            const products = doc.get("products") as any[];
            products.forEach(p => {                 
                total = total + (p.amount * p.unitPrice) 
            })
        });            
        setValue(total);

    }

    useEffect(() => {

        setTotal();

    }, [isPaidOnly, salesData]);


    return(
        <SafeAreaProvider>
            <SafeAreaView style = {{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
                <Header iconType="arrow-back"/>

                <View style = { styles.container }>
                    
                    <Text style = { styles.hint }>
                        Preencha os campos de data e pressione "Consultar" para consultar faturamento por período. <Text style = {{ fontFamily: "Inter_700Bold"}}>Caso algum dos campos
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
                        <View style = {{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center" }}>
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
                                    textAlign="center"
                                    placeholderTextColor={"rgba(0, 0, 0, 0.4)"}
                                />
                            </View>  
                        </View>

                        <View style = {{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center" }}>
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
                                    textAlign="center"
                                    placeholderTextColor={"rgba(0, 0, 0, 0.4)"}
                                />
                            </View>
                        </View>
                    </View>               

                    <View style = { styles.checkboxContainer }>
                        <Checkbox status = { isPaidOnly ? "checked" : "unchecked" } onPress={ () => setIsPaidOnly(prev => !prev) } color="#6D0808" style = { styles.checkbox } />
                        <Text style = { styles.checkboxLabel }>Considerar apenas as vendas que já foram pagas.</Text>
                    </View>

                    <TouchableOpacity
                        onPress={ async () => {
                            setIsLoading(true);
                            let init : Date;
                            let end : Date;
                            let total = 0;

                            if(initialDate === "" || endDate === "") {
                                init = new Date(Date.now());
                                init.setUTCHours(0);
                                init.setUTCMinutes(0);
                                init.setUTCSeconds(0);
                                init.setUTCMilliseconds(0);

                                end = new Date(Date.now());
                                end.setUTCHours(23);
                                end.setUTCMinutes(59);
                                end.setUTCSeconds(59);
                                end.setUTCMilliseconds(999);                                                                                                                         
                            } else {
                                const initialDateSplit = initialDate.split("/");
                                const endDateSplit = endDate.split("/");

                                init = new Date(parseInt(initialDateSplit[2]), parseInt(initialDateSplit[1]) - 1, parseInt(initialDateSplit[0]));                        
                                end = new Date(parseInt(endDateSplit[2]), parseInt(endDateSplit[1]) - 1, parseInt(endDateSplit[0]));
                                end.setUTCHours(23);
                                end.setUTCMinutes(59);
                                end.setUTCSeconds(59);
                                end.setUTCMilliseconds(999);                                
                            }                            
                            const q = query(collection(db, "sales"), where("createdAt", ">=", init),
                                where("createdAt", "<=", end));
                            const querySnapshot = await getDocs(q); 
                            const data = querySnapshot.docs;                            
                            setSalesData(data);                           
                            setTotal();
                            setIsLoading(false);
                        }}
                        style = { styles.button }
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
        justifyContent: "space-between",
        paddingHorizontal: "8%",
        width: "70%",
        borderRadius: 5,
        
    },
    textInput: {
        fontFamily: "Inter_400Regular",
        width: "70%",
        height: 42,
        justifyContent: "center"
    },
    value: {
        fontFamily: "Inter_700Bold",
        color: "#0A6D06",        
        fontSize: 40
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "center",
        width: "80%",
        marginVertical: 30
    },
    checkbox: {
        top: 4
    },
    checkboxLabel: {
        fontFamily: "Inter_400Regular"
    },
    button: {
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