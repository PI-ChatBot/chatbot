import React, { useEffect, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { formatDateTime } from "./utils/formatDateTime";
import ConfirmModal from "./utils/ConfirmModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { atualizarPedidos, obterPedidos, obterRestaurante } from "@/lib/data";

type Restaurante = {
  id_restaurante: string;
  id_unidade: string;
  nome: string;
  localizacao: string;
};

type Pedidos = [
  {
    id: string;
    subtotal: number;
    nome_cliente: string;
    itens: [
      {
        imagem: string | null;
        nome: string;
      },
    ];
  },
];

export default function TelaPedidos() {
  const router = useRouter();

  const irParaCardapio = () => {
    router.push("/cardapio");
  };

  const [dateTime, setDateTime] = useState(new Date());
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);

  useEffect(() => {
    async function getRestaurante() {
      const id = await AsyncStorage.getItem("restaurantId");
      console.log(id);
      if (id) {
        const restauranteData = await obterRestaurante(id!);
        setRestaurante(restauranteData["restaurante"]);
      }
    }
    getRestaurante();
  }, []);

  useEffect(() => {
    async function getData() {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        let pedidosData = await obterPedidos(token);
        setPedidos(pedidosData);
      }
    }
    getData();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("restaurantId");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("nome");
    router.replace("/");
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [pedidos, setPedidos] = useState<Pedidos | null>(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [itemId, setItemId] = useState(null);

  const abrirModal = (tipo, id) => {
    setItemId(id);
    setModalType(tipo); // Ex: 'cancelar' ou 'confirmar'
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setModalType(null);
    setItemId(null);
  };

  const executarAcao = () => {
    async function atualizar() {
      if (modalType === "cancelar" || modalType === "concluir") {
        const token = await AsyncStorage.getItem("token");
        await atualizarPedidos(token!, itemId!, modalType);
      } else if (modalType === "sair") {
        logout();
      }
    }
    atualizar();

    fecharModal();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => abrirModal("sair", "")}
          style={styles.botaoSair}
        >
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
        <View style={styles.centerContainer}>
          <Feather name="calendar" size={20} color="#333" style={styles.icon} />
          <Text style={styles.dateText}>{formatDateTime(dateTime)}</Text>
        </View>
        <View style={styles.side}>
          <TouchableOpacity
            onPress={irParaCardapio}
            style={styles.botaoCardapio}
          >
            <Text style={styles.buttonText}>Cardápio</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.underContainer}>
        <Text style={styles.infoRestaurante}>
          Restaurante: {restaurante?.nome}
        </Text>
        <View style={styles.tituloContainer}>
          <Text style={styles.tituloPedidos}>Pedidos</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.containerPedidos}>
        {pedidos &&
          pedidos.length > 1 &&
          pedidos.map((pedido) => (
            <View key={pedido.id} style={styles.card}>
              <View style={styles.viewTextoPedido}>
                <View></View>
                <Text style={styles.textoPedido}>Pedido {pedido.id}</Text>
                <TouchableOpacity
                  style={styles.botaoCancelar}
                  onPress={() => abrirModal("cancelar", pedido.id)}
                >
                  <Feather name="x" size={20} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.cardRow}>
                <View style={styles.grupoColumn}>
                  {pedido.itens &&
                    pedido.itens.map((item, key) => (
                      <View style={styles.grupo} key={key}>
                        <Image
                          source={`${item.imagem ? item.imagem : ""}`}
                          style={styles.imagem}
                        />
                        <Text style={styles.nome}>{item.nome}</Text>
                      </View>
                    ))}
                </View>
                <View style={styles.info}>
                  <View>
                    <Text style={styles.nome}>{pedido.nome_cliente}</Text>
                  </View>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.botaoConcluir}
                    onPress={() => abrirModal("concluir", pedido.id)}
                  >
                    <Text style={styles.botaoTexto}>Concluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
      </ScrollView>
      {/* Os componentes abaixo pertencem ao Modal para confirmar a confirmação ou o cancelamento do pedido. */}
      <ConfirmModal
        visible={isModalVisible}
        tipo={modalType}
        message={
          modalType === "concluir"
            ? `Tem certeza de que deseja confirmar o Pedido ${itemId}?`
            : modalType === "cancelar"
              ? `Tem certeza de que deseja cancelar o Pedido ${itemId}?`
              : "Tem certeza de que deseja sair da sua conta?"
        }
        onConfirm={executarAcao}
        onCancel={() => setModalVisible(false)}
        confirmText={
          modalType === "concluir"
            ? "Concluir Pedido"
            : modalType === "cancelar"
              ? "Cancelar Pedido"
              : "Sair da conta"
        }
        cancelText="Voltar"
      />
      {/* Fim do "Alert". */}
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
    flex: 1, // ocupa todo espaço entre os lados
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginRight: 40,
  },
  icon: {
    marginRight: 6,
  },
  dateText: {
    fontSize: 16,
    flexShrink: 1, // permite reduzir tamanho se necessário
    textAlign: "center",
  },
  underContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
    position: "relative",
  },
  infoRestaurante: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#444",
    position: "absolute",
  },
  tituloContainer: {
    flex: 1,
    alignItems: "center",
  },
  tituloPedidos: {
    fontSize: 45,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    marginRight: 0,
    color: "#333",
  },
  botaoSair: {
    backgroundColor: "#ed4141",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    padding: 10,
    zIndex: 1, // mantém os botões acima do texto central
    marginRight: 50,
  },
  botaoCardapio: {
    backgroundColor: "#1c8c9e",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    padding: 10,
    zIndex: 1, // mantém os botões acima do texto central
    marginRight: 50,
  },
  buttonText: {
    fontSize: 16,
    color: "#ffffff",
  },
  containerPedidos: {
    paddingVertical: 10,
  },
  card: {
    flex: 1,
    backgroundColor: "#eaeaea",
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  viewTextoPedido: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  grupoColumn: {
    flexDirection: "column",
  },
  grupo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  imagem: {
    width: 100,
    height: 100,
    borderRadius: 30,
    marginRight: 40,
    marginLeft: 40,
  },
  info: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 150,
  },
  nome: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 5,
  },
  textoPedido: {
    marginLeft: 50,
    fontSize: 25,
    fontWeight: "bold",
  },
  horario: {
    fontSize: 25,
    color: "#d2d2d2 ",
  },
  botaoConcluir: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginRight: 15,
  },
  botaoCancelar: {
    backgroundColor: "#ed4141",
    paddingHorizontal: 1,
    borderRadius: 50,
  },
  botaoTexto: {
    color: "white",
    fontSize: 25,
  },
});
