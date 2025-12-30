import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, SectionList, Image } from "react-native";
import { useEffect, useState } from "react";

import { useTheme, useNavigation } from "@react-navigation/native";
import { DrawerNavProps } from "../_layout";

import Header from "@/components/header";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import GeneralModal from "@/components/general-modal";

import { getFirestore, doc, getDoc, getDocs, collection, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { Product } from "@/types/definitions";

import FontAwesome from '@expo/vector-icons/FontAwesome';
import AddButton from "@/components/add-button";

const stock : Product[] = [

]

const list = [
    {
        title: "Alimento",
        data: [
            { name: "Alimento 1", price: 2},
            { name: "Alimento 2", price: 3},
            { name: "Alimento 3", price: 10},
        ]
    }
]

const stockA : Product[]  = [

    {        
        name: "Pipoca",        
        category: {
            name: "Alimentos"
        },
        amount: 50,
        sold: 20,
        cost: 0.20,
        price: 0.50,
        status: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },
    {
        name: "Doritos",        
        category: {
            name: "Alimentos"
        },
        amount: 75,
        sold: 36,
        cost: 1.5,
        price: 2.50,
        status: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },
    {
        name: "Pizza pequena",
        description: undefined,
        category: {
            name: "Alimentos"
        },
        amount: 20,
        sold: 5,
        cost: 8,
        price: 12.775,
        status: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },
    {
        name: "Pastel de frango",
        description: undefined,
        category: {
            name: "Alimentos"
        },
        amount: 15,
        sold: 13,
        cost: 2.50,
        price: 4,
        status: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },

    {
        name: "Coca-cola (1L)",
        description: undefined,
        category: {
            name: "Bebidas"
        },
        amount: 23,
        sold: 10,
        cost: 9,
        price: 11.50,
        status: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },
    {
        name: "Coca-cola zero (1L)",
        description: undefined,
        category: {
            name: "Bebidas"
        },
        amount: 23,
        sold: 20,
        cost: 10.90,
        price: 15,
        status: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },
    {
        name: "Guaraná Antártica (350mL)",
        description: undefined,
        category: {
            name: "Bebidas"
        },
        amount: 50,
        sold: 29,
        cost: 3,
        price: 5.50,
        status: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },

    {
        name: "Cachorro quente",
        description: undefined,        
        amount: 50,
        sold: 23,
        cost: 3,
        price: 5,
        status: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },

    {
        name: "Sorvete de morango",
        description: undefined,    
        category: {
            name: "Gelados"
        },    
        amount: 20,
        sold: 2,
        cost: 3,
        price: 6.50,
        status: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },

]

const sectionProducts = [
    {
        category: "Alimentos",
        data: [ stockA[0], stockA[1], stockA[2], stockA[3] ]
    },
    {
        category: "Bebidas",
        data: [ stockA[4], stockA[5], stockA[6] ]
    },
    {
        category: "Gelados",
        data: [ stockA[8] ]
    },
    {
        category: "Outros",
        data: [ stockA[7] ]
    },
]

type SectionProduct = {
    category: string,
    products: any[]
}

export default function StockScreen() {

    const [visibleModal, setVisibleModal] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [sp, setSp ] = useState<any[]>([]);
    const { colors } = useTheme();

    const getData = async () => {
        const querySnapshot = await getDocs(collection(db, "products"));
        if(querySnapshot.empty) {
            console.log("Nenhum dado foi encontrado");
        } else {
            console.log("Dados encontrados:", querySnapshot.docs);
        }
        return querySnapshot.docs;
    }

    const query = async () => {
            const productsQuery = await getDocs(collection(db, "products"));
            if(productsQuery.empty)
                return;
            
            const productsData = productsQuery.docs; 
            if(products.length > 0) setProducts([]);
            productsData.forEach((value) => setProducts((prev) => {                
                prev.push(
                    {                
                        name: value.get("name") as string,
                        description: value.get("description") as string,
                        price: value.get("price") as number,
                        cost: value.get("cost") as number,
                        amount: value.get("amount") as number,
                        sold: value.get("sold") as number,
                        status: value.get("status") as boolean,
                        createdAt: value.get("createdAt") as Timestamp,
                        updatedAt: value.get("updatedAt") as Timestamp
                    }
                );
                return prev;
            }))
        }
        
    useEffect(() => {
        query()
    }, []);

    useEffect(() => {        

        query();        

    }, [products, setProducts]);

    const calculateAmount = (amount : number | undefined, sold : number | undefined) => {
        if(amount !== undefined && sold !== undefined) 
            return (amount - sold).toString();
        return "Quantidades armazenadas e/ou vendidas não encontradas";
    }

    const reposition = (amount : number | undefined, sold : number | undefined) : boolean => {
        if(amount !== undefined && sold !== undefined) {
            const percent = ((amount - sold) / amount) * 100;
            if(percent < 30) return true;
        }
        return false;       
    }

    const chooseImage = (category : string) => {
        switch(category.toLocaleLowerCase()) {
            case "alimentos":
                return require("@/assets/images/food-default.jpg");                
            case "bebidas":
                return require("@/assets/images/drink-default.jpg");
            case "gelados":
                return require("@/assets/images/ice-cream-default.jpg");
            default:
                return require("@/assets/images/eat-default.jpg");         
        }
    }

    return(

        <SafeAreaProvider>
            <SafeAreaView style = {{ ...styles.container, backgroundColor: colors.background }}>
                <Header iconType="arrow-back"/>
                <Modal transparent = { true } visible = { visibleModal }>
                    <GeneralModal isOpen = { visibleModal } setIsOpen= { setVisibleModal } onSubmit={ () => query() } />
                </Modal>
                <View style = {{ width: "90%", flex: 1, justifyContent: "center",  }}>
                    {
                        products.length === 0 ? (
                            <View style = {{ alignItems: "center", justifyContent: "center" }}>
                                <Text style = { styles.emptyTitle }>Nenhum produto foi registrado</Text>
                                <Text style = { styles.emptySubtitle }>Aperte no botão abaixo para adicionar um produto.</Text>
                                <TouchableOpacity style = { styles.button } onPress = { () => setVisibleModal(true) }>
                                    <Text style = { styles.buttonTitle }>Adicionar Produto</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style = {{ flex: 1, marginBottom: 23 }}>                                
                                <View style = {{height: "100%"}}>
                                    <Text style = {{ fontFamily: "Inter_700Bold", fontSize: 22, textAlign: "center", marginVertical: 23 }}>Todos os Produtos</Text>
                                    <FlatList
                                        showsVerticalScrollIndicator = { false }
                                        data = { products }                                    
                                        renderItem = { ({ item }) => {
                                            return(
                                                <View style ={{ flexDirection: "row", alignItems: "center", width: "100%",  paddingVertical: 6, backgroundColor: "#FFFFFF", borderRadius: 5, marginBottom: 6, shadowColor: "#000000", shadowOffset: { width: 0, height: 3}, shadowOpacity: 0.1,  paddingLeft: 7}}> 
                                                    <Image source={ chooseImage(item.category ? item.category.name : "")} style = {{ width: 65, height: 65, resizeMode: "cover", borderRadius: 2, marginRight: 7 }}></Image>
                                                    <View>
                                                            <Text style = {{ fontFamily: "Inter_700Bold", fontSize: 18}}>{ item.name }</Text>
                                                            <View style ={{ flexDirection: "row"}}> 
                                                                <Text style = {{ fontFamily: "Inter_700Bold"}}>Quantidade: </Text>
                                                                <Text style = {{ fontFamily: "Inter_400Regular"}}>{ calculateAmount(item.amount, item.sold) }</Text>
                                                            </View>
                                                            {
                                                                reposition(item.amount, item.sold) ? (
                                                                    <View style = {{ flexDirection: "row", alignItems: "center", gap: 2, marginTop: 6 }}>
                                                                        <FontAwesome name="circle" size={7} color="#770E0E" />
                                                                        <Text style = {{ fontFamily: "Inter_400Regular", color: "rgba(0, 0, 0, 0.5)", fontSize: 10 }}>O produto necessita de reposição!</Text>
                                                                    </View>
                                                                ) : null
                                                            }
                                                        </View>
                                                    </View>
                                                    
                                            );
                                        }}                                                                       
                                    />
                                </View>
                                <View style = { styles.floatAddButton }>
                                    <AddButton onPress={ () => setVisibleModal(true) }/>
                                </View>
                            </View>                            
                        )
                    }                    
                </View>               
            </SafeAreaView>
        </SafeAreaProvider>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center"
    },

    emptyTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 22,
        textAlign: "center",
    },
    
    emptySubtitle: {
        color: "rgba(0, 0, 0, 0.5)",
        fontFamily: "Inter_400Regular",
        textAlign: "center",
        marginTop: 6,
        marginBottom: 20
    },

    button: {
        height: 32,
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0E9608",
        borderRadius: 5
    },

    buttonTitle: {
        color: "#FFFFFF",
        fontFamily: "Inter_700Bold",
    },

    floatAddButton: {
        position: "absolute",
        bottom: 50,
        right: 34,
        
        //shadowColor: "#000000", shadowOffset: { width: 0, height: 3}, shadowOpacity: 0.1
    },

});