import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, FlatList, ScrollView, Image, TouchableOpacity, Modal } from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import Header from "@/components/header";
import { PieChart } from "react-native-gifted-charts";
import Entypo from '@expo/vector-icons/Entypo';
import ProgressBar from "@/components/progress-bar";
import { DrawerNavProps } from "../_layout";
import { useEffect, useState } from "react";
import { collection, doc, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { TextInput } from "react-native-gesture-handler";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";


const goalData = [
    {
        description: "valor arrecadado",
        value: 4600
    }, 
    {
        description: "meta",
        value: 6000
    }
]

const saleData = [
    {
        name: "Coca-Cola (1L)",
        amount: 2,
        price: 9.25
    },
    {
        name: "Bolo de chocolate (fatia)",
        amount: 3,
        price: 7.5
    },
    {
        name: "Sanduíche natural",
        amount: 2,
        price: 6.25
    },
    {
        name: "Coca-Cola (1L)",
        amount: 1,
        price: 9.25
    },
    {
        name: "Pipoca salgada",
        amount: 6,
        price: 1.25
    },
]

const stockData = [
    {
        name: "Coca-Cola Lata (350 mL)",
        stock: 60,
        sold: 57
    },
    {
        name: "Fanta Uva (2L)",
        stock: 49,
        sold: 30
    },
    {
        name: "Pipoca Salgada",
        stock: 58,
        sold: 3
    }
]

const decimalStyle = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function HomeScreen() {
    
    const { colors } = useTheme(); 
    const navigation = useNavigation<DrawerNavProps>();
    const [totalValueSales, setTotalValueSales] = useState(0);
    const [goal, setGoal] = useState<{ id: string, value: number } | undefined>(undefined);
    const [showGoalModal, setShowGoalModal] = useState(false);

    /*const chartData = [
        {
            value: goalData[0].value,            
            color: "#4A1212",
            text: `${ (goalData[0].value / goalData[1].value * 100).toFixed(0) } %`         
        },
        {
            value: goalData[1].value -goalData[0].value,
            color: "#FFFFFF",            
            textBackground: "meta"
        }
    ];*/

    const chartData = [
        {
            value: totalValueSales,
            color: "#4A1212",
            text: (totalValueSales / (goal?.value || 0) * 100).toFixed(2) + " %"
        },
        {
            value: (goal?.value || 0) - totalValueSales,
            color: "#FFFFFF",
            textBackground: "Meta estabelecida",
            text: ((goal?.value || 0) - totalValueSales).toLocaleString("pt-BR", { style: "currency", currency: "BRL"})
        },
    ];

    useEffect(() => {

        const unsubSum = onSnapshot(query(collection(db, "sales")), (querySnapshot) => {
            if(querySnapshot.empty)
                return;

            const salesData = querySnapshot.docs;
            let totalValue = 0;

            salesData.forEach(e => {
                const productsList : any[] = e.get("products");
                productsList.forEach(p => {
                    totalValue = totalValue + (p.amount * p.unitPrice);
                });
            });

            setTotalValueSales(totalValue);
        });

        const unsubGoal = onSnapshot(query(collection(db, "goals"), orderBy("createdAt", "desc"), limit(1)), (querySnapshot) => {
            if(querySnapshot.empty) {
                setGoal(undefined);
                return;
            }
            const goalData = querySnapshot.docs[0];
            setGoal({ id: goalData.id, value: goalData.get("value") });
        });

        return () => { unsubSum(); unsubGoal() };

    }, []);

    return(

        <SafeAreaProvider>
            <SafeAreaView style = { [styles.container, { backgroundColor: colors.background }] }>
                <Header iconType="menu"/>
                <GoalModal visible = { showGoalModal } onClose={ () => setShowGoalModal(false) } goalData = { goal }></GoalModal>
                <ScrollView 
                    showsVerticalScrollIndicator = { false } 
                    contentContainerStyle = { styles.scrollViewContainer } 
                    style = {{ width: "100%" }}
                >
                    <View>
                        <TouchableOpacity style = { styles.goal } onPress={ () => setShowGoalModal(true) }>
                            <FontAwesome name = "usd" color = "#FFFFFF" size = { 20 }/>
                        </TouchableOpacity>
                        <View style = { styles.chartContainer }>
                            <PieChart 
                                data = { chartData }
                                donut 
                                showTooltip 
                                innerCircleColor = { colors.background }
                                textSize = { 22 }
                                font = "Inter_400Regular"
                                textBackgroundColor = "transparent"
                                innerRadius = { 90 }
                                paddingHorizontal = { 10 }
                                animationDuration = { 1000 }
                                isAnimated
                                labelLineConfig={{ length: 30 }}
                                tooltipDuration={ 1000 }                    
                                />
                            <Text style = { styles.chartTextBackground }>{ decimalStyle.format(totalValueSales) }</Text>
                        </View>                    
                        <Text style = { [styles.hint, { textAlign: "right", marginTop: 17 }] }>{"Gráfico do batimento\nde metas"}</Text>
                    </View>

                    <View style = { styles.buttonContainer }>
                        <TouchableOpacity
                            onPress={ () => navigation.navigate("Sales") }
                            style = { styles.button }
                        >
                            <Text style = { styles.buttonText }>Realizar Venda</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={ () => navigation.navigate("Stock") }
                            style = { styles.button }
                        >
                            <Text style = { styles.buttonText }>Verificar Estoque</Text>
                        </TouchableOpacity>
                    </View>

                    {/*<View style = {{ width: "90%", marginTop: 24 }}>
                        <Text style = {{ ...styles.hint, fontSize: 18, marginLeft: 23 }}>Vendas do dia</Text>
                        <FlatList                         
                            showsVerticalScrollIndicator = { false }                                                 
                            data = { saleData } 
                            style = { styles.salesList }
                            renderItem={({ item }) => <Sale data = { item }/>}
                        />                                    
                    </View>*/}

                    {<View style = {{ width: "90%", marginTop: 24 }}>
                        <Text style = {{ ...styles.hint, fontSize: 18, marginLeft: 23 }}>Situação do estoque</Text>
                        <FlatList
                            showsVerticalScrollIndicator = { false }
                            data = { stockData }
                            style = {{ marginTop: 12 }}
                            renderItem = { ({ item }) => <StockAlert data = { item }/> }
                        />                
                    </View>}
                </ScrollView>                               
            </SafeAreaView>
        </SafeAreaProvider>

    );

}

function GoalModal({ visible = false, onClose, goalData } : { visible: boolean, onClose: () => void, goalData : any }) {
    const [goal, setGoal] = useState("0,00");
    const update = async () => {
        if(isNaN(Number(goal.replace(",", "."))))
            return;

        const goalRef = doc(db, "goals", goalData.id);
        await updateDoc(goalRef, {
            value: Number(goal.replace(",", ".")),
            updatedAt: serverTimestamp()
        });

        onClose();
        setGoal("0,00");
    };

    return(
        <Modal transparent = { true } visible = { visible }>
            <View style = { goalModalStyles.background }>
                <View style = { goalModalStyles.container }>
                    <MaterialCommunityIcons name = "close-thick" onPress={ () => { onClose(); setGoal("0,00") } } color = "#6D0808" size = { 24 } style = { goalModalStyles.closeIcon } />
                    <Text style = { goalModalStyles.title }>Defina uma meta</Text>
                    <Text style = { goalModalStyles.hint }>Informe o valor que se deseja arrecadar no evento deste ano.</Text>
                    <View style = { goalModalStyles.inputContainer }>
                        <Text style = {{ fontFamily: "Inter_400Regular" }}>R$</Text>
                        <TextInput 
                            style = { goalModalStyles.textInput } 
                            inputMode="decimal"
                            value = { goal }
                            onChangeText = { (value) => setGoal(value) }
                        />
                    </View>
                    <TouchableOpacity style = { goalModalStyles.button } onPress={ () => update() }>
                        <Text style = { goalModalStyles.buttonText }>Salvar</Text>
                    </TouchableOpacity>                    
                </View>
            </View>
        </Modal>
    );

}

function Sale({ data } : any) {

    return(
        <View style = { styles.saleItem }>
            <Entypo name = "triangle-right" style = {{ marginRight: 5 }}></Entypo>
            <Text style = {{ ...styles.saleItemText, width: "20%" }}>{ data.amount + " un." }</Text>
            <Text style = {{ ...styles.saleItemText, width: "80%", textAlign: "center", paddingHorizontal:"5%" }} numberOfLines={ 1 }>{ data.name }</Text>                                    
            <Text style = {{ ...styles.saleItemText, width: "25%", textAlign: "right" }}>{ decimalStyle.format(data.amount * data.price) }</Text>                                    
        </View>  
    );

}

function StockAlert({ data } : any) {

    const remains = data.stock - data.sold;
    const percentRemains = (remains / data.stock) * 100;

    const message = () => {
        if(remains > 1) {
            return "Restam " + remains + " unidades."
        } else if (remains > 0) {
            return "Resta 1 unidade."
        } else {
            return "O produto acabou."
        }
    }    

    return(
        <View style = { styles.stockAlertItem }>
            <Image source = { require("@/assets/images/food-default.jpg") } style = { styles.stockAlertImage }/>
            <View style = {{ width: "100%", paddingRight: 85 }}>
                <View style = {{ gap: 3, marginBottom: 3 }}>
                    <Text style = {{ fontSize: 18, fontFamily: "Inter_400Regular"}}>{ data.name }</Text>
                    <ProgressBar value = { percentRemains }/>                                    
                </View>                
                <Text style = {{ fontSize: 12, color: "#959595", fontFamily: "Inter_400Regular" }}>{ message() }</Text>               
            </View>
        </View>
    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",    
    },

    scrollViewContainer: { 
        alignItems: "center", 
        justifyContent: "center", 
        height: "100%", 
        
    },

    goal: {
        backgroundColor: "#0E9608",
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        position: "absolute",
        right: 0,
        zIndex: 1
    },

    chartContainer: {
        alignItems: "center",
        justifyContent: "center",        
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
    },

    salesList: {
        marginTop: 12,
        height: 192,
        backgroundColor: "#D9D9D9",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 5,
    },

    saleItem: {
        flexDirection: "row",
        justifyContent: "space-between",  
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.5)",
        paddingVertical: 9,
        alignItems: "center"
    },

    saleItemText: {
        fontSize: 15,
        fontFamily: "Inter_400Regular",                         
    },

    stockAlertItem: { 
        backgroundColor: "#FFFFFF", 
        height: 72, 
        marginBottom: 7, 
        borderRadius: 5, 
        flexDirection: "row", 
        alignItems: "center"
    },

    stockAlertImage: {
        width: 65, 
        height: 65, 
        resizeMode: "cover", 
        borderRadius: 2, 
        marginLeft: 3, 
        marginRight: 6
    },
    buttonContainer: {
        gap: 10, 
        width: "100%", 
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    button: {
        backgroundColor: "#770E0E",
        paddingVertical: 8,
        width: "70%",
        borderRadius: 5
    },
    buttonText: {
        fontFamily: "Inter_700Bold",
        color: "#FFFFFF",
        textAlign: "center"
    },
});

const goalModalStyles = StyleSheet.create({
    background: {
        flex: 1, 
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignItems: "center",
        justifyContent: "center"
    },
    container: {
        backgroundColor: "#FFFFFF",
        width: "90%",
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: "center"
    },
    closeIcon: {
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 1
    },
    title: {
        fontFamily: "Inter_700Bold",
        fontSize: 22,
        textAlign: "center"
    },
    hint: {
        fontFamily: "Inter_400Regular",
        fontSize: 12,
        opacity: 0.5,
        textAlign: "center",
        marginVertical: 20
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E9E9E9",
        borderRadius: 3,
        paddingHorizontal: 13,
        width: "50%"
    },
    textInput: {
        fontFamily: "Inter_400Regular",
        width: "100%",
        height: 42
    },
    button: {
        backgroundColor: "#0E9608",
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 8,
        borderRadius: 5,
        marginTop: 25
    },
    buttonText: {
        color: "#FFFFFF",
        fontFamily: "Inter_700Bold",
    },
});
