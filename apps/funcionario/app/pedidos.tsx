import React, { useEffect, useState } from 'react';
import { Animated, Image, StyleSheet, SafeAreaView, TouchableOpacity, View, Text, ScrollView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { storage } from './utils/storage';
import { formatDateTime } from './utils/formatDateTime';
import ConfirmModal from './utils/ConfirmModal';

const mockPedidos2 = [
    {
      id: '1',
      nome: 'Rony Weasley',
      pratos: [{prato: 'Frango', imagem: require('../assets/images/Robo.png'), quantidade: 1}, {prato: 'Ovo', imagem: require('../assets/images/Robo.png'), quantidade: 1}],
      horario: '12:45',
    },
  ]
const mockPedidos1 = [
    {
      id: '1',
      nome: 'João Silva',
      pratos: [{prato: 'Macarrão', imagem: require('../assets/images/Robo.png'), quantidade: 1}, {prato: 'Manga', imagem: require('../assets/images/Robo.png'), quantidade: 1}],
      horario: '12:45',
    },
    {
      id: '2',
      nome: 'Maria Souza',
      pratos: [{prato: 'Macarrão', imagem: require('../assets/images/Robo.png'), quantidade: 1}, {prato: 'Manga', imagem: require('../assets/images/Robo.png'), quantidade: 1}],
      horario: '12:50',
    },
    {
      id: '3',
      nome: 'Felipe Dias',
      pratos: [{prato: 'Macarrão', imagem: require('../assets/images/Robo.png'), quantidade: 1}, {prato: 'Manga', imagem: require('../assets/images/Robo.png'), quantidade: 1}],
      horario: '13:00',
    },
    {
      id: '4',
      nome: 'Felipe Dias',
      pratos: [{prato: 'Macarrão', imagem: require('../assets/images/Robo.png'), quantidade: 1}, {prato: 'Manga', imagem: require('../assets/images/Robo.png'), quantidade: 1}],
      horario: '13:00',
    },
    {
      id: '5',
      nome: 'Felipe Dias',
      pratos: [{prato: 'Macarrão', imagem: require('../assets/images/Robo.png'), quantidade: 1}, {prato: 'Manga', imagem: require('../assets/images/Robo.png'), quantidade: 1}],
      horario: '13:00',
    },
    {
      id: '6',
      nome: 'Felipe Dias',
      pratos: [{prato: 'Macarrão', imagem: require('../assets/images/Robo.png'), quantidade: 1}, {prato: 'Manga', imagem: require('../assets/images/Robo.png'), quantidade: 1}],
      horario: '13:00',
    },
    {
      id: '7',
      nome: 'Felipe Dias',
      pratos: [{prato: 'Macarrão', imagem: require('../assets/images/Robo.png'), quantidade: 1}, {prato: 'Manga', imagem: require('../assets/images/Robo.png'), quantidade: 1}],
      horario: '13:00',
    },
    {
      id: '8',
      nome: 'Felipe Dias',
      pratos: [{prato: 'Macarrão', imagem: require('../assets/images/Robo.png'), quantidade: 1}, {prato: 'Manga', imagem: require('../assets/images/Robo.png'), quantidade: 1}],
      horario: '13:00',
    },
  ];

export default function TelaPedidos() {
  const router = useRouter();
  
  const irParaCardapio = () => {
    router.push('/cardapio');
  }

  const [dateTime, setDateTime] = useState(new Date());

  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  useEffect(() => {
    const id = storage.get('restaurantId');
    if (!id) {
      setTimeout(() => router.replace('/'), 0); // volta para login se não logado
    } else {
      setRestaurantId(id);
    }
  }, []);

  const logout = () => {
    storage.remove('restaurantId');
    router.replace('/');
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // Aqui você puxaria os dados do banco, mas estamos simulando
    console.log(restaurantId)
    restaurantId == 'rest_a' 
    ? setPedidos(mockPedidos1)
    : setPedidos(mockPedidos2)
  }, [restaurantId]);

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
    if (modalType === 'cancelar') {
      setPedidos((prev) => prev.filter((pedido) => pedido.id !== itemId));
    } 
    
    else if (modalType === 'concluir') {
      setPedidos((prev) => prev.filter((pedido) => pedido.id !== itemId));
    }

    else if (modalType === 'sair') {
      logout();
    }

    fecharModal();
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
          <TouchableOpacity onPress={() => abrirModal('sair', '')} style={styles.botaoSair}>
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        <View style={styles.centerContainer}>
          <Feather name="calendar" size={20} color="#333" style={styles.icon} />  
          <Text style={styles.dateText}>{formatDateTime(dateTime)}</Text>
        </View>
        <View style={styles.side}>
          <TouchableOpacity onPress={irParaCardapio} style={styles.botaoCardapio}>
            <Text style={styles.buttonText}>Cardápio</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.underContainer}>
        <Text style={styles.infoRestaurante}>Restaurante [nome do restaurante] {restaurantId}</Text>
        <View style={styles.tituloContainer}>
          <Text style={styles.tituloPedidos}>Pedidos</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.containerPedidos}>
          {pedidos.map((pedido) => (
            <View key={pedido.id} style={styles.card}>
              <View style={styles.viewTextoPedido}>
                <View></View>
                <Text style={styles.textoPedido}>Pedido {pedido.id}</Text>
                <TouchableOpacity
                    style={styles.botaoCancelar}
                    onPress={() => abrirModal('cancelar', pedido.id)}
                  >
                    <Feather name="x" size={20} color="white" />
                  </TouchableOpacity>
              </View>
              <View style={styles.cardRow}>
                <View style={styles.grupoColumn}>
                  {pedido.pratos.map((item) => (
                    <View style={styles.grupo}>
                      <Image  
                        source={item.imagem} 
                        style={styles.imagem} 
                      />
                      <Text style={styles.nome}>{item.prato}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.info}>
                  <View>
                    <Text style={styles.nome}>{pedido.nome}</Text>
                  </View>       
                  <View>
                    <Text style={styles.horario}>Horário: {pedido.horario}</Text>
                  </View>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.botaoConcluir}
                    onPress={() => abrirModal('concluir', pedido.id)}
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
        tipo = {modalType}
        message={
           modalType === 'concluir'
            ? `Tem certeza de que deseja confirmar o Pedido ${itemId}?`
            : modalType === 'cancelar'
              ? `Tem certeza de que deseja cancelar o Pedido ${itemId}?`
              : 'Tem certeza de que deseja sair da sua conta?'
            
        }
        onConfirm={executarAcao}
        onCancel={() => setModalVisible(false)}
        confirmText={
          modalType === 'concluir'
          ? 'Concluir Pedido'
          : modalType === 'cancelar'
            ?'Cancelar Pedido'
            : 'Sair da conta'
        }
        cancelText="Voltar"
      />
      {/* Fim do "Alert". */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginBox: {
        width: 400,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0px 4px 8px rgba(0,0,0,0.1)', // só funciona no web
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        height: 48,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    successText: {
        marginTop: 20,
        color: 'green',
        fontSize: 16,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 12,
        textAlign: 'center',
    },
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
    flex: 1, // ocupa todo espaço entre os lados
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 40,
  },
  icon: {
    marginRight: 6,
  },
  dateText: {
    fontSize: 16,
    flexShrink: 1, // permite reduzir tamanho se necessário
    textAlign: 'center',
  },
  underContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      width: '100%',
      position: 'relative',
  },
  infoRestaurante: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'#444',
    position: 'absolute',
  },
  tituloContainer: {
    flex: 1,
    alignItems: 'center'
  },
  tituloPedidos: {
    fontSize: 45,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 0,
    color: '#333',
  },
  botaoSair: {
    backgroundColor: '#ed4141',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    padding: 10,
    zIndex: 1, // mantém os botões acima do texto central
    marginRight: 50 
  },
  botaoCardapio: {
    backgroundColor: '#1c8c9e',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    padding: 10,
    zIndex: 1, // mantém os botões acima do texto central
    marginRight: 50 
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
  },
  containerPedidos: {
    paddingVertical: 10,
  },
  card: {
    flex:1,
    backgroundColor: '#eaeaea',
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  viewTextoPedido: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  grupoColumn: {
    flexDirection: 'column',
  },
  grupo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  imagem: {
    width: 100,
    height: 100,
    borderRadius: 30,
    marginRight: 40,
    marginLeft: 40
  },
  info: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 150
  },
  nome: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textoPedido: {
    marginLeft: 50,
    fontSize: 25,
    fontWeight: 'bold'
  },
  horario: {
    fontSize: 25,
    color: '#d2d2d2 ',
  },
  botaoConcluir: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginRight: 15
  },
  botaoCancelar: {
    backgroundColor: '#ed4141',
    paddingHorizontal: 1,
    borderRadius: 50,
  },
  botaoTexto: {
    color: 'white',
    fontSize: 25,
  },
});

