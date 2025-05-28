import React, { useEffect, useState } from 'react';
import { Animated, Image, StyleSheet, SafeAreaView, TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { formatDateTime } from './utils/formatDateTime';

export default function HomeScreen() {
  const router = useRouter();
  
  const irParaCardapio = () => {
    router.push('/cardapio');
  }

  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  const mockPedidos = [
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

  const [pedidos, setPedidos] = useState([]);
  
  useEffect(() => {
    // Aqui você puxaria os dados do banco, mas estamos simulando
    setPedidos(mockPedidos);
  }, []);

  const concluirPedido = (id) => {
    setPedidos((prev) => prev.filter((pedido) => pedido.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
          <View style={styles.side}></View>
          <View style={styles.centerContainer}>
            <Feather name="calendar" size={20} color="#333" style={styles.icon} />  
            <Text style={styles.dateText}>{formatDateTime(dateTime)}</Text>
          </View>
          <View style={styles.side}>
            <TouchableOpacity onPress={irParaCardapio} style={styles.button}>
              <Text style={styles.buttonText}>Cardápio</Text>
            </TouchableOpacity>
          </View>
      </View>
      <Text style={styles.tituloPedidos}>Pedidos</Text>
      <ScrollView contentContainerStyle={styles.containerPedidos}>
          {pedidos.map((pedido) => (
            <View key={pedido.id} style={styles.card}>
              <View style={styles.viewTextoPedido}>
                <Text style={styles.textoPedido}>Pedido {pedido.id}</Text>
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
                <TouchableOpacity
                  style={styles.botaoConcluir}
                  onPress={() => concluirPedido(pedido.id)}
                >
                  <Text style={styles.botaoTexto}>Concluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
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
    flex: 1, // ocupa todo espaço entre os lados
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
    alignItems: 'center'
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
  },
  nome: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textoPedido: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  horario: {
    fontSize: 25,
    color: '#d2d2d2 ',
  },
  botaoConcluir: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginRight: 15
  },
  botaoTexto: {
    color: 'white',
    fontSize: 15,
  },
});
