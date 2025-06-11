import React, { useEffect, useState } from 'react';
import { Animated, Image, Switch, Modal, TextInput, FlatList, useWindowDimensions, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { formatDateTime } from './utils/formatDateTime';
import { storage } from './utils/storage';
import ConfirmModal from './utils/ConfirmModal';
import * as ImagePicker from 'expo-image-picker';

const cardapio1 = [
    { id: '1', 
      nome: 'Feijoada',
      preco: '35,00',
      imagem: require('../assets/images/Robo.png'),
      descricao:'É um feijão preto',
      categoria:'Feijões',
      promocional: false,
    },
    { id: '2',
      nome: 'Moqueca', 
      preco: '42,00', 
      imagem: require('../assets/images/Robo.png'),
      descricao:'',
      categoria:'Nem sei oq é isso',
      promocional: false,
    },
    { id: '3', 
      nome: 'Churrasco', 
      preco: '50,00', 
      imagem: require('../assets/images/Robo.png'),
      descricao:'é tipo carne',
      categoria:'carne',
      promocional: false,
    },
    { id: '4', 
      nome: 'Escondidinho', 
      preco: '28,00', 
      imagem: require('../assets/images/react-logo.png'),
      descricao:'shhhh',
      categoria:'tá escondido',
      promocional: false,
    },
    { id: '5', 
      nome: 'Lasanha', 
      preco: '30,00',
      imagem: require('../assets/images/Robo.png'),
      descricao:'pizza',
      categoria:'pizza',
      promocional: true,
    },
    { id: '6', 
      nome: 'Salada', 
      preco: '18,00', 
      imagem: require('../assets/images/Robo.png'),
      descricao:'é verde',
      categoria:'fôia',
      promocional: false,
    },
    { id: '7', 
      nome: 'Hambúrguer',
      preco: '25.00',
      imagem: require('../assets/images/Robo.png'),
      descricao:'pão',
      categoria:'carne',
      promocional: false,
    },
    { id: '8', 
      nome: 'Pizza',
      preco: 44.98,
      imagem: require('../assets/images/Robo.png'),
      descricao:'pizza',
      categoria:'pizza',
      promocional: false,
    },
    { id: '9', 
      nome: 'Sopa',
      preco: 22.5, 
      imagem: require('../assets/images/icon.png'),
      descricao:'líquido',
      categoria:'caldos',
      promocional: false,
    },
    { id: '10', 
      nome: 'Cuscuz', 
      preco: '20,00', 
      imagem: require('../assets/images/Robo.png'),
      descricao:'é tipo um bolo?',
      categoria:'?',
      promocional: true,
    },
];
const cardapio2 = [
    { id: '1', 
      nome: 'Água',
      preco: '5,00',
      imagem: require('../assets/images/Robo.png'),
      descricao:'',
      categoria:'',
      promocional: false,
    },
]

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2; 

export default function TelaCardapio(){
  const router = useRouter();
  
  const irParaPedidos = () => {
  router.push('/pedidos');
  }
  const [dateTime, setDateTime] = useState(new Date());
  const [cardapio, setCardapio] = useState([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);
  const [itemExcluindo, setItemExcluindo] = useState(null);

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [promocional, setPromocional] = useState<boolean>(false);

  const [imagem, setImagem] = useState<string | null>(null);

  const abrirModalEditarVisible = (item) => {
    setItemEditando(item);
    setNome(item.nome);
    setPreco(item.preco.toString());
    setDescricao(item.descricao);
    setCategoria(item.categoria);
    setPromocional(item.promocional);
    setImagem(item.imagem || null);
    setModalEditarVisible(true);
  };

  const abrirModalAdicionar = () => {
    setItemEditando(null);
    setNome('');
    setPreco('');
    setDescricao('');
    setCategoria('');
    setPromocional(false);
    setImagem(null);
    setModalEditarVisible(true);
  };

  const escolherImagem = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  const salvarItem = () => {
    if (!nome || !preco) return;

    const novoItem = {
      id: itemEditando ? itemEditando.id : Date.now().toString(),
      nome,
      preco: parseFloat(preco.replace(',', '.')),
      imagem,
      descricao,
      categoria,
      promocional
    };

    if (itemEditando) {
      setCardapio((prev) =>
        prev.map((item) => (item.id === novoItem.id ? novoItem : item))
      );
    } else {
      setCardapio((prev) => [...prev, novoItem]);
    }

    setModalEditarVisible(false);
  };

  const confirmarExclusao = (item) => {
    setItemExcluindo(item);
    setModalConfirmVisible(true);
  };

  const excluirItem = () => {
    // Colocar a lógica do banco de dados aqui
    setCardapio((prev) => prev.filter((item) => item.id !== itemExcluindo.id));
    setModalConfirmVisible(false);
  };

  useEffect(() => {
    const id = storage.get('restaurantId');
    if (!id) {
      setTimeout(() => router.replace('/'), 0); // volta para login se não logado
    } else {
      setRestaurantId(id);
    }
  }, []);

  useEffect(() => {
    // Aqui você puxaria os dados do banco, mas estamos simulando
    restaurantId == 'rest_a' 
    ? setCardapio(cardapio1)
    : setCardapio(cardapio2)
  }, [restaurantId]);

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
      <View style={[styles.card, { width: itemWidth, marginHorizontal: spacing / 2 }]}>
        <View style={styles.containerBotoes}>
          <View></View>
          <View>
            <Text style={{marginLeft: 70, fontSize: 20}}>{item.promocional ? 'Promocional' : ''}</Text>
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
          <Image source={item.imagem } style={styles.imagem} />
          <Text style={styles.nome} numberOfLines={1}>{item.nome}</Text>
          <Text style={styles.preco}>R$ {parseFloat(item.preco).toFixed(2).replace('.', ',')}</Text>
          <Text style={[styles.preco, {fontSize: 16}]}>{item.descricao}</Text>
          <Text>Categoria: {item.categoria}</Text>
        </View>
      </View>
  );

  return(
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
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textoBotaoAdicionar}>Adicionar Item</Text>
                <Feather name="plus-circle" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.tituloPedidos}>Cardápio</Text>
          <ScrollView>
            <View style={styles.containerFlatList}>
                <FlatList
                    data={cardapio}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={numColumns}
                />
            </View>
          </ScrollView>
          {/* MODAL DE EDITAR/ADICIONAR */}
          <Modal 
            visible={modalEditarVisible} 
            transparent={true} 
            animationType="fade" 
            onRequestClose={() => setModalEditarVisible(false)}
          >
            <View style={styles.overlay}>
              <View style={styles.modal}>
                <Text style={styles.tituloModal}>{itemEditando ? 'Editar' : 'Adicionar'} Item</Text>
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
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: 16, marginRight: 10, paddingVertical: 10}}>Promocional</Text>
                  <Switch
                    value={promocional}
                    onValueChange={(valor) => setPromocional(valor)}
                  />
                </View>
                <TouchableOpacity onPress={escolherImagem} style={{ marginVertical: 10 , marginBottom: 20}}>
                  <Text style={{ color: '#007AFF' }}>
                    {imagem ? 'Trocar imagem' : 'Escolher imagem'}
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
          tipo = {'excluir'}
          message={`Tem certeza que deseja excluir o prato ${itemExcluindo?.nome}?`}
          onConfirm={excluirItem}
          onCancel={() => setModalConfirmVisible(false)}
          confirmText={'Excluir'}
          cancelText="Voltar"
        />
  
      </SafeAreaView>
  );
}
const styles = StyleSheet.create({
   safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
 topBar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  side: {
    width: 60, // lateral com espaço fixo
    alignItems: 'center',
  },
  centerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  icon: {
    marginRight: 6,
  },
  dateText: {
    fontSize: 16,
    flexShrink: 1, // permite reduzir tamanho se necessário
    textAlign: 'center',
  },
  tituloPedidos: {
    fontSize: 45,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#1c8c9e',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    padding: 10,
    zIndex: 1, // mantém os botões acima do texto central
    marginLeft: 50, 
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
  },
  botaoAdicionar: {
    margin: 5,
    backgroundColor: '#10b200',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 50,
  },
  textoBotaoAdicionar: {
    fontSize: 16,
    color: '#ffffff',
    marginRight: 5,
  },
  containerFlatList: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerBotoes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  botaoExcluir: {
    margin: 5,
    backgroundColor: '#ed4141',
    paddingHorizontal: 1,
    borderRadius: 50,
  },
  botaoEditar: {
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0892ff',
    padding: 4,
    borderRadius: 50,
  },
  containerInformacoes: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    paddingBottom: 6,
  },
  imagem: {
    width: '80%',
    height: 150, 
    resizeMode: 'contain',
  },
  nome: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  preco: {
    fontSize: 18,
    color: '#555',
    marginTop: 2,
  },
  adicionar: {
    backgroundColor: '#007AFF',
    padding: 12,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 8,
  },
  modalBotoes: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 10 
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  tituloModal: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    width: '25%',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  botaoCancelar: { 
    backgroundColor: '#ed4141',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    padding: 10,
    color: '#ffffff',
    fontSize: 16,
  },
  botaoSalvar: {
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    padding: 10,
    color: '#ffffff',
    fontSize: 16,
  },

})