import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Image, TextInput, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import Header from "@/components/header";
import { doc, getDoc, addDoc, getDocs, collection, Timestamp, deleteDoc, query, onSnapshot, updateDoc, increment } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AddButton from "@/components/add-button";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { MultiSelect } from "react-native-element-dropdown";

type Product = {
    id?: string,
    name: string,
    description?: string,
    categories?: string[],
    amount: number,
    unitPrice: number,
    unitCost: number,
    sold: number,
    status: boolean,
    createdAt?: Timestamp,
    updatedAt?: Timestamp
};

type Category = {
    id?: string,
    name: string,
    description?: string,
    createdAt: Timestamp,
    updatedAt: Timestamp
};

type StockModalProps = {
    onSubmit?: () => void;
    onClose: () => void;
    categories?: Category[],
    productData?: Product,
    isVisible?: boolean,
    product?: Product,
};

const stockA : Product[]  = [

    {        
        name: "Pipoca",        
        categories: [ "Alimentos" ],
        amount: 50,
        sold: 20,
        unitCost: 0.20,
        unitPrice: 0.50,
        status: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },
    {
        name: "Doritos",        
        categories: [ "Alimentos", "Lanches" ],
        amount: 75,
        sold: 36,
        unitCost: 1.5,
        unitPrice: 2.50,
        status: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },
    {
        name: "Pizza pequena",        
        categories: [ "Alimentos" ],
        amount: 20,
        sold: 5,
        unitCost: 8,
        unitPrice: 12.775,
        status: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },
    {
        name: "Pastel de frango",
        categories: [ "Alimentos", "Pastéis" ],
        amount: 15,
        sold: 13,
        unitCost: 2.50,
        unitPrice: 4,
        status: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },

    {
        name: "Coca-cola (1L)",
        categories: [ "Bebidas", "Refrigerantes" ],
        amount: 23,
        sold: 10,
        unitCost: 9,
        unitPrice: 11.50,
        status: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },
    {
        name: "Coca-cola zero (1L)",
        categories: [ "Bebidas", "Refrigerantes"],
        amount: 23,
        sold: 20,
        unitCost: 10.90,
        unitPrice: 15,
        status: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },
    {
        name: "Guaraná Antártica (350mL)",        
        categories: [ "Bebidas", "Refrigerantes" ],
        amount: 50,
        sold: 29,
        unitCost: 3,
        unitPrice: 5.50,
        status: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },

    {
        name: "Cachorro quente",  
        categories: [ "Alimentos", "Lanches" ],             
        amount: 50,
        sold: 23,
        unitCost: 3,
        unitPrice: 5,
        status: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },

    {
        name: "Sorvete de morango",
        description: undefined,    
        categories: [ "Gelados", "Sorvetes" ],    
        amount: 20,
        sold: 2,
        unitCost: 3,
        unitPrice: 6.50,
        status: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },

    {
        name: "Coxinha",
        description: undefined,    
        categories: [ "Alimentos", "Lanches" ],    
        amount: 20,
        sold: 2,
        unitCost: 3,
        unitPrice: 6.50,
        status: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },

    {
        name: "Sorvete de morango",
        description: undefined,    
        categories: [ "Gelados", "Sorvetes" ],    
        amount: 20,
        sold: 2,
        unitCost: 3,
        unitPrice: 6.50,
        status: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    },

];

const mockedCategories : Category[] = [
    {
        name: "Alimentos",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    },
    {
        name: "Bebidas",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    },
    {
        name: "Lanches",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    },
]


export default function StockScreen() {

    const [visibleModal, setVisibleModal] = useState(false);
    const [upgradeAmount, setUpgradeAmount] = useState<Product | undefined>(undefined);
    const [products, setProducts] = useState<Product[] | undefined>(undefined);
    const [categories, setCategories] = useState<Category[]>([]);
    const { colors } = useTheme();

    const queryManual = async () => {
        const productsQuery = await getDocs(collection(db, "products"));
        if(productsQuery.empty)
            return;
        
        const productsData = productsQuery.docs; 
        setProducts(productsData.map(e => {
            return {
                id: e.id,
                name: e.get("name"),
                description: e.get("description"),
                categories: e.get("categories"),
                unitPrice: e.get("price"),
                unitCost: e.get("cost"),
                amount: e.get("amount"),
                sold: e.get("sold"),
                status: e.get("status"),
                createdAt: e.get("createdAt"),
                updatedAt: e.get("updatedAt")
            };
        }).sort(function(a, b) {
            return a.name.localeCompare(b.name);
        }));   
    };

    const getCategories = async () => {
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        if(categoriesSnapshot.empty) 
            return;
            
        const categoriesData = categoriesSnapshot.docs;
        setCategories(categoriesData.map(e => {
            return {
                id: e.id,
                name: e.get("name"),
                description: e.get("description"),
                createdAt: e.get("createdAt"),
                updatedAt: e.get("updatedAt")
            };
        }));        
    }

    const deleteProduct = async (id : string) => {
        try {
            await deleteDoc(doc(db, "products", id));            
        } catch(e) {
            console.log("Erro ao deletar produto do banco de dados:", e);
        }
    }
        
    useEffect(() => {

        const unsub = onSnapshot(query(collection(db, "products")), (querySnapshot) => {
            if(querySnapshot.empty)
                return;

            const productsData = querySnapshot.docs;
            setProducts(productsData.map(e => {
                return {
                    id: e.id,
                    name: e.get("name"),
                    description: e.get("description"),
                    categories: e.get("categories"),
                    unitPrice: e.get("price"),
                    unitCost: e.get("cost"),
                    amount: e.get("amount"),
                    sold: e.get("sold"),
                    status: e.get("status"),
                    createdAt: e.get("createdAt"),
                    updatedAt: e.get("updatedAt")
                }
            }).sort(function(a, b) {
                return a.name.localeCompare(b.name);
            }));
        });

        return () => unsub();

    }, []);    

    const reposition = (amount : number, sold : number) : boolean => {
        const percent = ((amount - sold) / amount) * 100;
        return percent < 30;
    };

    const selectImage = (categories : string[] | undefined) => {
        categories = categories?.map(e => e.toLocaleLowerCase());
        if(categories?.includes("alimentos"))
            return require("@/assets/images/food-default.jpg");    
        if(categories?.includes("bebidas"))
            return require("@/assets/images/drink-default.jpg");
        if(categories?.includes("gelados"))
            return require("@/assets/images/ice-cream-default.jpg");
        return require("@/assets/images/eat-default.jpg");   
    };

    return(
        <SafeAreaProvider>
            <SafeAreaView style = {{ ...styles.container, backgroundColor: colors.background }}>
                <Header iconType="arrow-back"/>
                <StockModal 
                    isVisible = { visibleModal } 
                    onSubmit = { () => setVisibleModal(false) } 
                    onClose = { () => setVisibleModal(false) } 
                    categories={ mockedCategories }
                /> 
                {
                    upgradeAmount !== undefined ? (
                        <AmountModal onClose={ () => setUpgradeAmount(undefined)} product = { upgradeAmount }></AmountModal>
                    ) : null
                }                                      
                {
                    products === undefined ? (
                        <View style = { styles.loadingContainer }>
                            <ActivityIndicator size = { 40 } color = "#6D0808"/>
                            <Text style = { styles.loadingText }>Carregando produtos...</Text>
                        </View>
                    ) : products.length === 0 ? (
                        <View style = {{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                            <Text style = { styles.emptyTitle }>Nenhum produto foi registrado</Text>
                            <Text style = { styles.emptySubtitle }>Aperte no botão abaixo para adicionar um produto.</Text>
                            <TouchableOpacity style = { styles.button } onPress = { () => setVisibleModal(true) }>
                                <Text style = { styles.buttonTitle }>Adicionar Produto</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style = { styles.productsContainer }>                                
                            <Text style = { styles.productsTitle }>Todos os Produtos</Text>
                            <FlatList
                                showsVerticalScrollIndicator = { false }
                                data = { products }                                    
                                renderItem = { ({ item }) => {
                                    return(
                                        <TouchableOpacity style ={ styles.itemContainer } onPress={ () => setUpgradeAmount(item) }> 
                                            <View style = { styles.productInfo }>
                                                <Image source = { selectImage(item.categories) } style = { styles.productImage } resizeMode = "cover"/>
                                                <View>
                                                        <Text style = { styles.productName } numberOfLines = {1}>{ item.name }</Text>                                                        
                                                        <Text style = {{ fontFamily: "Inter_400Regular", marginVertical: 3 }}>
                                                            <Text style = {{ fontFamily: "Inter_700Bold"}}>Quantidade: </Text>{ item.amount - item.sold }
                                                        </Text>                                                            
                                                        {
                                                            reposition(item.amount, item.sold) ? (
                                                                <View style = { styles.repositionAdvice }>
                                                                    <FontAwesome name="circle" size={7} color="#770E0E" />
                                                                    <Text style = { styles.repositionAdviceText }>O produto necessita de reposição!</Text>
                                                                </View>
                                                            ) : null
                                                        }
                                                </View>
                                            </View>
                                            
                                            <View style = {{ flexDirection: "row", gap: 15 }}>
                                                <TouchableOpacity>
                                                    <Feather name="edit-2" size={24} color="black" onPress={() => null} />
                                                </TouchableOpacity>
                                                <TouchableOpacity style = {{ backgroundColor: "#6D0808", padding: 4, borderRadius: 4 }}>
                                                    <FontAwesome6 name="trash" size={18} color="white" onPress = { () => deleteProduct(item.id!) } />
                                                </TouchableOpacity>

                                            </View>
                                        </TouchableOpacity>
                                            
                                    );
                                }}                                                                       
                            />
                            <View style = { styles.floatAddButton }>
                                <AddButton onPress={ () => setVisibleModal(true) } title = "Adicionar Produto"/>
                            </View>
                        </View>                            
                    )
                }             
            </SafeAreaView>
        </SafeAreaProvider>

    );

}

function StockModal({ onClose, categories, productData, isVisible = false } : StockModalProps) {

    const [categoriesList, setCategoriesList] = useState<Category[] | undefined>(categories);
    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
    const [categoryName, setCategoryName] = useState<string | undefined>(undefined);
    const [categoryDescription, setCategoryDescription] = useState<string | undefined>(undefined);
    const [createCategory, setCreateCategory] = useState<boolean>(false);
    const [priceString, setPriceString] = useState<string>("0");
    const [costString, setCostString] = useState<string>("0");
    
    const productReference : Product = {
        name: "",
        amount: 0,
        status: true,
        categories: [],
        unitPrice: 0,
        sold: 0,
        unitCost: 0,
        description: "",
        createdAt: undefined,
        updatedAt: undefined
    }
    const [product, setProduct] = useState<Product>(productReference);

    const formatDecimal = (value : string, prev : string, attribute : "cost" | "price") => {
        
        if(value === "," || value === ".") {
            if(prev === "")
                return "0."
            if(!prev.includes("."))
                return prev + ".";
        } else if(!isNaN(Number(value))) {
            if(attribute === "cost") {
                if(value !== "") {
                    setProduct({ ...product, unitCost: Number(value)});
                } else {
                    setProduct({ ...product, unitCost: Number(value)});
                }
            } else if(attribute === "price") {
                if(value !== "") {
                    setProduct({ ...product, unitPrice: Number(value)});
                } else {
                    setProduct({ ...product, unitPrice: Number(value)});
                }
            }                            
            return value;
        }                                        
        return prev;

    }

    const addProduct = async () => {
        try {                        
            const add = await addDoc(collection(db, "products"), { 
                name: product.name,
                amount: product.amount,
                status: product.status,
                ...(selectedCategories.length > 0 ? { categories: selectedCategories } : {}),
                unitPrice: product.unitPrice,
                unitCost: product.unitCost,
                sold: 0,
                ...(product.description !== "" ? { description: product.description } : {}),
                createdAt: Timestamp.now(), 
                updatedAt: Timestamp.now() 
            });
            setSelectedCategories([]);
            setCostString("");
            setPriceString("");
            setProduct(productReference),            
            onClose();                      
        } catch(e) {
            console.log("Erro ao adicionar o produto: " + e);
        }        
    }

    const addCategory = async () => {
        try {            
            await addDoc(collection(db, "categories"), { 
                name: categoryName, 
                ...(categoryDescription !== "" ? { description: categoryDescription } : {}),
                createdAt: Timestamp.now(), 
                updatedAt: Timestamp.now() 
            });            
            setCategoryName("");
            if(categoryDescription !== "")
                setCategoryDescription("");
        } catch(e) {
            console.log("Erro ao adicionar categoria:", e);
        }
    }
    
    return(
        <Modal visible = { isVisible } transparent = { true }>
            <View style = { stylesModal.container }>
                <View style = { stylesModal.background }>
                    <MaterialCommunityIcons name = "close-thick" onPress={ () => onClose() } color = "#6D0808" size = { 24 } style = { stylesModal.closeIcon } />
                    <Text style = { stylesModal.title }>Novo Produto</Text>
                    <Text style = { stylesModal.hint }>Preencha as informações abaixo para adicionar um produto ao estoque.</Text>
                    
                    <View style = { stylesModal.textInputContainer }>
                        <View style = {{ gap: 8, width: "70%" }}>
                            <Text style = { stylesModal.titleTextInput }>Nome</Text>
                            <TextInput style = { stylesModal.textInput } value = { product.name } onChangeText = { (value) => setProduct({ ...product, name: value }) } />
                        </View>                    
                        <View style = {{ gap: 8, width: "30%" }}>
                            <Text style = { stylesModal.titleTextInput }>Quantidade</Text>
                            <TextInput 
                                style = { stylesModal.textInput } 
                                value = { product.amount.toString() } 
                                onChangeText = { (value) => {
                                        if(!isNaN(Number(value)))
                                            setProduct({ ...product, amount: Number(value) }); 
                                        return;
                                    }
                                } 
                                inputMode = "numeric" />
                        </View>                    
                    </View>

                    <View style = {{ ... stylesModal.textInputContainer, marginVertical: 10 }}>
                        <View style = {{ gap: 8, width: "50%" }}>
                            <Text style = { stylesModal.titleTextInput }>Custo Unitário</Text>
                            <TextInput 
                                style = { stylesModal.textInput } 
                                value = { costString }
                                onChangeText= { (value) => { console.log(value), setCostString((prev) => formatDecimal(value, prev, "cost"))} }
                                inputMode = "decimal" 
                            />
                        </View>                     
                        <View style = {{ gap: 8, width: "50%" }}>
                            <Text style = {{ fontFamily: "Inter_700Bold", fontSize: 10, marginLeft: 15 }}>Preço Unitário</Text>
                            <TextInput 
                                style = {{ ...stylesModal.textInput }}
                                value = { priceString }
                                onChangeText = { (value) => setPriceString((prev => formatDecimal(value, prev, "price"))) } 
                                inputMode = "decimal" 
                            />
                        </View> 
                    </View>

                    {
                        categoriesList !== undefined ? (
                            <View style = {{ width: "90%", marginVertical: 10,   justifyContent: "center" }}>                            
                                <MultiSelect
                                    data = { categoriesList }
                                    labelField = "name"
                                    valueField = "name"
                                    onChange={ (value) => setSelectedCategories(value) }
                                    placeholder = "Selecione uma ou mais categorias"                                                                
                                    value = { selectedCategories }                                                             
                                />
                                
                            </View>                        
                        ) : null
                    }

                    <View style = {{ width: "90%", marginBottom: 30, }}>
                        <TouchableOpacity style = {{ flexDirection: "row", alignItems: "center", gap: 3 }} onPress = { () => setCreateCategory((prev) => !prev) }>
                            <Entypo name = { !createCategory ? "triangle-right" : "triangle-down" } color = { "rgba(0, 0, 0, 0.5)" } />
                            <Text style = {{ color: "rgba(0, 0, 0, 0.5)" }}>Criação de categoria</Text>                        
                        </TouchableOpacity>
                        {
                                createCategory ? (
                                    <View style = {{ paddingHorizontal: 20, marginTop: 10,  gap: 10 }}>
                                        <TextInput 
                                            placeholder="Nome da categoria" 
                                            style = {{ ...stylesModal.textInput, backgroundColor: "#FFFFFF", borderWidth: 1}}
                                            placeholderTextColor = { "rgba(0, 0, 0, 0.5)" }
                                            value = { categoryName }
                                            onChangeText = { (value) => setCategoryName(value) }
                                        />
                                        <TextInput 
                                            placeholder="Descrição da categoria" 
                                            style = {{ ...stylesModal.textInput, backgroundColor: "#FFFFFF", borderWidth: 1}}
                                            placeholderTextColor = { "rgba(0, 0, 0, 0.5)" }
                                            value = { categoryDescription }
                                            onChangeText = { (value) => setCategoryDescription(value) }
                                        />
                                        <TouchableOpacity 
                                            style = {{ borderWidth: 1, borderRadius: 5, width: "40%", paddingVertical: 3, marginTop: 5, justifyContent: "center", alignItems: "center", alignSelf: "center", shadowColor: "#000000", shadowOffset: { width: 0, height: 4}, shadowOpacity: 0.2, shadowRadius: 8 }}
                                            onPress ={ () => {
                                                addCategory();                                            
                                                setCreateCategory(false);
                                                return;
                                            }}
                                        >
                                            <Text>Criar</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : null
                        }
                    </View>

                    <View style = { stylesModal.textInputContainer }>
                        <View style = {{ gap: 8, width: "101%" }}>
                            <Text style = {{ fontFamily: "Inter_700Bold", fontSize: 10, marginLeft: 15 }}>Descrição</Text>
                            <TextInput 
                                style = {{ ...stylesModal.textInput, height: 80 }} 
                                multiline = { true }
                                value = { product?.description || "" }
                                onChangeText = { (value) => setProduct({ ...product, description: value }) }
                            />
                        </View> 
                    </View>
                    
                    <TouchableOpacity style = { stylesModal.button } onPress={ () => addProduct() }>
                        <Text style = { stylesModal.buttonText }>Adicionar</Text>                    
                    </TouchableOpacity>
                </View>            
            </View>
        </Modal>
    );

}

function AmountModal({ onClose, product } :StockModalProps) {
    const [option, setOption] = useState<undefined | string>(undefined);
    const [value, setValue] = useState("");
    const currentAmount = product!.amount - product!.sold;
    const [newAmount, setNewAmount] = useState(currentAmount.toString());
    const [updating, setUpdating] = useState(false);

    const incrementAmount = async() => {
        if(product === undefined || product.id === undefined)
            return;
        setUpdating(true);
        const docRef = doc(db, "products", product.id);
        await updateDoc(docRef, {
            amount: increment(Number(value)),
            updatedAt: Timestamp.now()
        });
        setUpdating(false);
    };

    const updateAmount = async() => {
        if(product === undefined || product.id === undefined)
            return;
        setUpdating(true);
        const docRef = doc(db, "products", product.id);
        await updateDoc(docRef, {
            amount: Number(value),
            sold: 0,
            updatedAt: Timestamp.now()
        });
        setUpdating(false);
    };

    const updateStatus = async() => {
        if(product === undefined || product.id === undefined)
            return;        
        const docRef = doc(db, "products", product.id);
        await updateDoc(docRef, {
            status: !(product.status),
            updatedAt: Timestamp.now()
        });
    }

    useEffect(() => {

    }, [product]);
    
    return(
        <Modal transparent = { true }>
            <View style = { stylesModal.container }>
                <View style = { stylesModal.background }>
                    <MaterialCommunityIcons name = "close-thick" onPress={ () => onClose() } color = "#6D0808" size = { 24 } style = { stylesModal.closeIcon } />
                    {
                        option === undefined ? (
                            <View style = {{ width: "90%" }}>
                                <Text style = { stylesModal.title }>Escolha uma opção</Text>
                                <TouchableOpacity 
                                    style = {{ borderBottomWidth: 0.2, borderBottomColor: "rgba(0, 0, 0, 0.2)", marginTop: 30, paddingBottom: 5}}
                                    onPress={ () => setOption("increment") }
                                >
                                    <Text style = { stylesModal.optionTitle }>Adicionar quantidade</Text>
                                    <Text style = {{ ...stylesModal.hint, textAlign: "left", marginVertical: 0, width: "100%" }}>Escolha esta opção para incrementar a quantidade existente.</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style = {{ borderBottomWidth: 0.2, borderBottomColor: "rgba(0, 0, 0, 0.2)", paddingBottom: 5}}
                                    onPress={ () => setOption("transform")}
                                >
                                    <Text style = { stylesModal.optionTitle }>Atualizar quantidade</Text>
                                    <Text style = {{ ...stylesModal.hint, textAlign: "left", marginVertical: 0, width: "100%" }}>Escolha esta opção para determinar uma nova quantidade para o produto.</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={ () => {
                                    if(product?.status) {
                                        setOption("status");
                                    } else {
                                        updateStatus();
                                        onClose();
                                    }
                                }}>
                                    <Text style = { stylesModal.optionTitle }>{ product?.status ? "Desativar produto" : "Ativar produto"}</Text>
                                    <Text style = {{ ...stylesModal.hint, textAlign: "left", marginVertical: 0, width: "100%" }}>
                                        {
                                            product?.status ? "Escolha esta opção para interromper a venda deste produto." : "Escolha esta opção para permitir a venda deste produto."
                                        }
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : option === "increment" ? (
                            <View style = {{ width: "90%" }}>
                                <View>
                                    <Text style = {{ fontFamily: "Inter_400Regular", fontSize: 18}}><Text style = {{ fontFamily: "Inter_700Bold"}}>Produto:</Text> {product?.name}</Text>
                                    <Text style = {{ fontFamily: "Inter_400Regular", fontSize: 15}}><Text style = {{ fontFamily: "Inter_700Bold"}}>Quantidade atual:</Text> { currentAmount }</Text>
                                    <Text style = {{ fontFamily: "Inter_400Regular", fontSize: 15}}><Text style = {{ fontFamily: "Inter_700Bold"}}>Quantidade pós-incremento:</Text> { newAmount }</Text>
                                </View>
                                <Text style = {{ fontFamily: "Inter_400Regular", textAlign: "center", marginVertical: 20 }}>
                                    Informe a quantidade que será acrescentada:
                                </Text>
                                <TextInput 
                                    autoFocus
                                    style = {{ ...stylesModal.textInput, width: "20%", alignSelf: "center" }}                                                                    
                                    value = { value }
                                    onChangeText = { (value) => {
                                        setValue(value);
                                        setNewAmount((currentAmount + Number(value)).toString());
                                    } }  
                                    inputMode="numeric"                                 
                                />
                                <TouchableOpacity 
                                    style = {{ ...stylesModal.button, width: "50%", alignSelf: "center" }}
                                    onPress = { () => {
                                        if(Number(value) < 0 ) return;
                                        incrementAmount();
                                        setOption(undefined);                               
                                    } }
                                >
                                    {
                                        updating ? <ActivityIndicator color = "#FFFFFF" /> : <Text style = { stylesModal.buttonText }>Incrementar</Text>
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style = {{ ...stylesModal.button, width: "50%", marginTop: 8, alignSelf: "center"}}
                                    onPress={ () => setOption(undefined) }
                                >
                                    <Text style = { stylesModal.buttonText }>Voltar</Text>
                                </TouchableOpacity>
                            </View>
                        ) : option === "transform" ? (
                            <View style = {{ width: "90%" }}>
                                <Text style = {{ fontFamily: "Inter_400Regular", fontSize: 18}}><Text style = {{ fontFamily: "Inter_700Bold"}}>Produto:</Text> {product?.name}</Text>
                                <Text style = {{ fontFamily: "Inter_400Regular", fontSize: 15}}><Text style = {{ fontFamily: "Inter_700Bold"}}>Quantidade atual:</Text> { currentAmount }</Text>
                                <Text style = {{ fontFamily: "Inter_400Regular", textAlign: "center", marginVertical: 20 }}>
                                    Informe a nova quantidade:
                                </Text>
                                <TextInput 
                                    autoFocus
                                    style = {{ ...stylesModal.textInput, width: "20%", alignSelf: "center" }}                                                                    
                                    value = { value }
                                    onChangeText = { (value) => setValue(value) }  
                                    inputMode="numeric"                                 
                                />
                                <TextInput />
                                <TouchableOpacity 
                                    style = {{ ...stylesModal.button, width: "50%", alignSelf: "center", marginTop: 0 }}
                                    onPress = { () => {
                                        if(Number(value) < 0 ) return;
                                        updateAmount();
                                        setOption(undefined);                               
                                    } }
                                >
                                    {
                                        updating ? <ActivityIndicator color = "#FFFFFF" /> : <Text style = { stylesModal.buttonText }>Atualizar</Text>
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style = {{ ...stylesModal.button, width: "50%", marginTop: 8, alignSelf: "center"}}
                                    onPress={ () => setOption(undefined) }
                                >
                                    <Text style = { stylesModal.buttonText }>Voltar</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style = {{ width: "90%" }}>
                                <Text style = {{ fontFamily: "Inter_700Bold", textAlign: "center"}}>
                                    Esta ação impedirá a venda do produto até que seja ele seja ativado novamente. Deseja continuar?
                                </Text>
                                <View style = {{ flexDirection: "row", gap : 20, justifyContent: "center", marginTop: 20 }}>
                                    <TouchableOpacity 
                                        onPress={ () => {
                                            updateStatus();
                                            onClose();
                                            setOption(undefined);
                                        }}
                                        style = {{ ...stylesModal.confirmationButton, backgroundColor: "#6D0808" }}
                                    >
                                        <Text style = { stylesModal.buttonText }>Sim</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style = {{ ...stylesModal.confirmationButton }}
                                        onPress={ () => setOption(undefined) }
                                    >
                                        <Text style = { stylesModal.buttonText }>Não</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }
                </View>
            </View>
        </Modal>
    );

}

const styles = StyleSheet.create({

    container: { 
        flex: 1,   
        alignItems: "center"                
    },
    loadingContainer: {
        flex: 1,        
        alignItems: "center",
        justifyContent: "center",
        gap: 20
    },
    loadingText: {
        fontFamily: "Inter_400Regular",
        fontSize: 15,
        opacity: 0.5
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
    productsContainer: {
        marginBottom: 23, 
        width: "94%",
        flex: 1
    },
    productsTitle: { 
        fontFamily: "Inter_700Bold", 
        fontSize: 22, 
        textAlign: "center", 
        marginVertical: 23 
    },
    itemContainer: { 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: 'space-between', 
        width: "100%",  
        paddingVertical: 6, 
        backgroundColor: "#FFFFFF", 
        borderRadius: 5, 
        marginBottom: 6, 
        shadowColor: "#000000", 
        shadowOffset: { width: 0, height: 3}, 
        shadowOpacity: 0.1, 
        shadowRadius: 4, 
        paddingLeft: 7, 
        paddingRight: 20
    },
    productInfo: {
        flexDirection: "row", 
        alignItems: "center", 
        width: "80%"
    },
    productName: {
        fontFamily: "Inter_700Bold", 
        fontSize: 18 
    },
    productImage: {
        width: 65, 
        height: 65,         
        borderRadius: 2, 
        marginRight: 7 
    },
    repositionAdvice: {
        flexDirection: "row", 
        alignItems: "center", 
        gap: 2
    },
    repositionAdviceText: {
        fontFamily: "Inter_400Regular", 
        opacity: 0.5, 
        fontSize: 12
    },
    floatAddButton: {
        position: "absolute",
        bottom: "4%",
        alignSelf: "center"        
    },

});

const stylesModal = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",        
    },

    background: {
        backgroundColor: "#FFFFFF",
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 50,
    },

    closeIcon: {
        position: "absolute",
        top: 16,
        right: 16
    },

    title: {
        fontFamily: "Inter_700Bold",
        fontSize: 22,
        textAlign: "center"
    },

    optionTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 16
    },

    hint: {
        fontFamily: "Inter_400Regular",
        fontSize: 12,
        color: "#959595",
        textAlign: "center",
        marginVertical: 13,
        width: "80%"
    },

    textInputContainer: {
        flexDirection: "row", 
        width: "90%", 
        gap: 9, 
        alignItems: "center", 
        justifyContent: "center"
    },

    titleTextInput: {
        fontFamily: "Inter_700Bold", 
        fontSize: 10, 
        marginLeft: 15
    },

    textInput: {
        backgroundColor: "#E9E9E9", 
        height: 35, 
        borderRadius: 3, 
        paddingHorizontal: 13
    },

    button: {
        height: 40,
        width: "80%",
        backgroundColor: "#0E9608",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        marginTop: 25
    },

    buttonText: {
        fontFamily: "Inter_700Bold",
        fontSize: 15,
        textAlign: "center",
        color: "#FFFFFF"
    },

    confirmationButton: {
        backgroundColor: "#0E9608",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5
    },

});