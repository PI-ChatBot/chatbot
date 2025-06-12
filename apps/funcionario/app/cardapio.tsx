import React, { useEffect, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  FlatList,
  TextInput,
  Switch,
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
import {
  criarPrato,
  deletarPrato,
  editarPrato,
  ItemCardapio,
  obterPratos,
  obterRestaurante,
} from "@/lib/data";
import ConfirmModal from "./utils/ConfirmModal";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";

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
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [itemEditando, setItemEditando] = useState<ItemCardapio | null>(null);
  const [itemExcluindo, setItemExcluindo] = useState<ItemCardapio | null>(null);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [promocional, setPromocional] = useState<boolean>(false);

  const [imagem, setImagem] = useState<string | null>(null);

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

  const abrirModalEditarVisible = (item) => {
    setItemEditando(item);
    setNome(item.nome);
    setPreco(item.preco.toString());
    setDescricao(item.descricao);
    setCategoria("");
    setPromocional(false);
    setImagem(item.imagem || null);
    setModalEditarVisible(true);
  };

  const abrirModalAdicionar = () => {
    setItemEditando(null);
    setNome("");
    setPreco("");
    setDescricao("");
    setCategoria("");
    setPromocional(false);
    setImagem(null);
    setModalEditarVisible(true);
  };

  const escolherImagem = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result) {
      const { data, error } = await supabase.storage
        .from("imagens-cardapio")
        .upload(
          restaurante!.nome
            .split(" ")
            .join("")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") + result.assets[0].fileName!,
          await result.assets[0].file?.arrayBuffer()!,
          {
            contentType: "image/png",
          },
        );
      if (error) {
        console.log(error.message);
        return;
      }
      let path = data.path;
      {
        const { data } = supabase.storage
          .from("imagens-cardapio")
          .getPublicUrl(path);
        setImagem(data.publicUrl);
        console.log(data.publicUrl);
      }
    }
  };

  const salvarItem = () => {
    async function salvar() {
      if (!nome || !preco) return;
      let id_item = null;
      if (itemEditando?.id_item) {
        id_item = itemEditando.id_item;
      }
      const novoItem: ItemCardapio = {
        id_item: id_item,
        nome: nome,
        preco: parseFloat(preco.replace(",", ".")),
        imagem: imagem,
        descricao: descricao,
        categoria: categoria,
        promocional: promocional,
      };
      console.log(novoItem);
      let token_funcionario = await AsyncStorage.getItem("token");
      if (itemEditando) {
        await editarPrato(token_funcionario!, novoItem);
      } else {
        await criarPrato(token_funcionario!, novoItem);
      }
      setModalEditarVisible(false);
    }
    salvar();
  };

  const confirmarExclusao = (item) => {
    setItemExcluindo(item);
    setModalConfirmVisible(true);
  };

  const excluirItem = () => {
    async function excluir() {
      let token_funcionario = await AsyncStorage.getItem("token");
      await deletarPrato(token_funcionario!, itemExcluindo?.id_item!);
      console.log(itemExcluindo?.id_item);
      setModalConfirmVisible(false);
    }
    excluir();
  };
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

  const { width } = useWindowDimensions();
  const numColumns = 5;
  const spacing = 10;
  const totalSpacing = spacing * (numColumns + 1);
  const itemWidth = (width - totalSpacing) / numColumns;

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        { width: itemWidth, marginHorizontal: spacing / 2 - 1 },
      ]}
    >
      <View style={styles.containerBotoes}>
        <View></View>
        <View>
          <Text style={{ marginLeft: 70, fontSize: 20 }}>
            {item.promocional ? "Promocional" : ""}
          </Text>
        </View>
        <View style={styles.containerBotoes}>
          <TouchableOpacity
            style={styles.botaoExcluir}
            onPress={() => confirmarExclusao(item)}
          >
            <Feather name="x" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() => abrirModalEditarVisible(item)}
          >
            <Feather name="edit-2" size={15} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.containerInformacoes}>
        <Image source={item.imagem} style={styles.imagem} />
        <Text style={styles.nome} numberOfLines={1}>
          {item.nome}
        </Text>
        <Text style={styles.preco}>
          R$ {parseFloat(item.preco).toFixed(2).replace(".", ",")}
        </Text>
        <Text style={[styles.preco, { fontSize: 16 }]}>{item.descricao}</Text>
        <Text>Categoria: {item.categoria}</Text>
      </View>
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
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={abrirModalAdicionar}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.textoBotaoAdicionar}>Adicionar Item</Text>
            <Feather name="plus-circle" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.tituloPedidos}>Cardápio</Text>
      <View style={styles.containerFlatList}>
        <FlatList
          data={pratos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_item}
          numColumns={numColumns}
          contentContainerStyle={{ padding: spacing }}
        />
      </View>
      {/* MODAL DE EDITAR/ADICIONAR */}
      <Modal
        visible={modalEditarVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalEditarVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.tituloModal}>
              {itemEditando ? "Editar" : "Adicionar"} Item
            </Text>
            <TextInput
              placeholder="Nome"
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Preço"
              value={preco}
              onChangeText={setPreco}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
              style={styles.input}
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Categoria"
              value={categoria}
              onChangeText={setCategoria}
              style={styles.input}
              placeholderTextColor="#aaa"
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ fontSize: 16, marginRight: 10, paddingVertical: 10 }}
              >
                Promocional
              </Text>
              <Switch
                value={promocional}
                onValueChange={(valor) => setPromocional(valor)}
              />
            </View>
            <TouchableOpacity
              onPress={escolherImagem}
              style={{ marginVertical: 10, marginBottom: 20 }}
            >
              <Text style={{ color: "#007AFF" }}>
                {imagem ? "Trocar imagem" : "Escolher imagem"}
              </Text>
            </TouchableOpacity>
            <View style={styles.modalBotoes}>
              <TouchableOpacity onPress={() => setModalEditarVisible(false)}>
                <Text style={styles.botaoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={salvarItem}>
                <Text style={styles.botaoSalvar}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL DE CANCELAR: */}
      <ConfirmModal
        visible={modalConfirmVisible}
        tipo={"excluir"}
        message={`Tem certeza que deseja excluir o prato ${itemExcluindo?.nome}?`}
        onConfirm={excluirItem}
        onCancel={() => setModalConfirmVisible(false)}
        confirmText={"Excluir"}
        cancelText="Voltar"
      />
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
  botaoAdicionar: {
    margin: 5,
    backgroundColor: "#10b200",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 50,
  },
  textoBotaoAdicionar: {
    fontSize: 16,
    color: "#ffffff",
    marginRight: 5,
  },
  containerFlatList: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerBotoes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  botaoExcluir: {
    margin: 5,
    backgroundColor: "#ed4141",
    paddingHorizontal: 1,
    borderRadius: 50,
  },
  botaoEditar: {
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0892ff",
    padding: 4,
    borderRadius: 50,
  },
  containerInformacoes: {
    alignItems: "center",
  },
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
    paddingBottom: 6,
  },
  imagem: {
    width: "80%",
    height: 150,
    resizeMode: "contain",
  },
  nome: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
  preco: {
    fontSize: 18,
    color: "#555",
    marginTop: 2,
  },
  adicionar: {
    backgroundColor: "#007AFF",
    padding: 12,
    alignItems: "center",
    marginTop: 20,
    borderRadius: 8,
  },
  modalBotoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    width: "25%",
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  botaoCancelar: {
    backgroundColor: "#ed4141",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    padding: 10,
    color: "#ffffff",
    fontSize: 16,
  },
  botaoSalvar: {
    backgroundColor: "#28a745",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    padding: 10,
    color: "#ffffff",
    fontSize: 16,
  },
});
