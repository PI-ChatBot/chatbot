import React, { useEffect, useState } from "react";
import {
  Animated,
  Image,
  FlatList,
  useWindowDimensions,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { formatDateTime } from "./utils/formatDateTime";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { obterPratos, obterRestaurante } from "@/lib/data";

const pratos1 = [
  {
    id: "1",
    nome: "Feijoada",
    preco: "R$ 35,00",
    imagem: require("../assets/images/Robo.png"),
  },
  {
    id: "2",
    nome: "Moqueca",
    preco: "R$ 42,00",
    imagem: require("../assets/images/Robo.png"),
  },
  {
    id: "3",
    nome: "Churrasco",
    preco: "R$ 50,00",
    imagem: require("../assets/images/Robo.png"),
  },
  {
    id: "4",
    nome: "Escondidinho",
    preco: "R$ 28,00",
    imagem: require("../assets/images/react-logo.png"),
  },
  {
    id: "5",
    nome: "Lasanha",
    preco: "R$ 30,00",
    imagem: require("../assets/images/Robo.png"),
  },
  {
    id: "6",
    nome: "Salada",
    preco: "R$ 18,00",
    imagem: require("../assets/images/Robo.png"),
  },
  {
    id: "7",
    nome: "Hambúrguer",
    preco: "R$ 25,00",
    imagem: require("../assets/images/Robo.png"),
  },
  {
    id: "8",
    nome: "Pizza",
    preco: "R$ 40,00",
    imagem: require("../assets/images/Robo.png"),
  },
  {
    id: "9",
    nome: "Sopa",
    preco: "R$ 22,00",
    imagem: require("../assets/images/icon.png"),
  },
  {
    id: "10",
    nome: "Cuscuz",
    preco: "R$ 20,00",
    imagem: require("../assets/images/Robo.png"),
  },
];
const pratos2 = [
  {
    id: "1",
    nome: "Água",
    preco: "R$ 5,00",
    imagem: require("../assets/images/Robo.png"),
  },
];

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 48) / 2;

type Restaurante = {
  id_restaurante: string;
  id_unidade: string;
  nome: string;
  localizacao: string;
};

export default function TelaCardapio() {
  const router = useRouter();

  const irParaPedidos = () => {
    router.push("/pedidos");
  };
  const [dateTime, setDateTime] = useState(new Date());
  const [pratos, setPratos] = useState([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);

  useEffect(() => {
    async function getData() {
      const id = await AsyncStorage.getItem("restaurantId");
      if (!id) {
        setTimeout(() => router.replace("/"), 0); // volta para login se não logado
      } else {
        setRestaurantId(id);
      }
    }
    getData();
  }, []);

  // useEffect(() => {
  //   async function getRestaurante() {
  // const id = await AsyncStorage.getItem("restaurantId");
  // console.log(id);
  // if (id) {
  //   const restauranteData = await obterRestaurante(id!);
  //   setRestaurante(restauranteData["restaurante"]);
  // }
  // }
  // getRestaurante();
  // }, []);

  useEffect(() => {
    async function getPratos() {
      const id = await AsyncStorage.getItem("restaurantId");
      console.log(id);
      if (id) {
        const pratosData = await obterPratos(id!);
        setPratos(pratosData["pratos"]);
      }
    }
    getPratos();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { width } = useWindowDimensions();
  const numColumns = 5;
  const spacing = 10;
  const totalSpacing = spacing * (numColumns + 1);
  const itemWidth = (width - totalSpacing) / numColumns;

  const renderItem = ({ item }) => (
    <View
      key={item.id}
      style={[styles.card, { width: itemWidth, marginHorizontal: spacing / 2 }]}
    >
      <Image source={item.imagem} style={styles.imagem} />
      <Text style={styles.nome} numberOfLines={1}>
        {item.nome}
      </Text>
      <Text style={styles.preco}>R${item.preco}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <View style={styles.side}>
          <TouchableOpacity onPress={irParaPedidos} style={styles.button}>
            <Text style={styles.buttonText}>Pedidos</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <Feather name="calendar" size={20} color="#333" style={styles.icon} />
          <Text style={styles.dateText}>{formatDateTime(dateTime)}</Text>
        </View>
        <View style={styles.side}></View>
      </View>
      <Text style={styles.tituloPedidos}>Cardápio</Text>
      <View style={styles.containerFlatList}>
        <FlatList
          data={pratos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={{ padding: spacing }}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f8f8f8",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  side: {
    width: 60, // lateral com espaço fixo
    alignItems: "center",
  },
  centerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  icon: {
    marginRight: 6,
  },
  dateText: {
    fontSize: 16,
    flexShrink: 1, // permite reduzir tamanho se necessário
    textAlign: "center",
  },
  tituloPedidos: {
    fontSize: 45,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  button: {
    backgroundColor: "#1c8c9e",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    padding: 10,
    zIndex: 1, // mantém os botões acima do texto central
    marginLeft: 50,
  },
  buttonText: {
    fontSize: 16,
    color: "#ffffff",
  },
  containerFlatList: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 6,
  },
  imagem: {
    width: "80%",
    height: 150,
    resizeMode: "contain",
  },
  nome: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
  preco: {
    fontSize: 11,
    color: "#555",
    marginTop: 2,
  },
});
