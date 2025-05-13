import React, { useRef, useEffect, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function TelaFAQ() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState({});

  const faqItems = [
    {
      id: 1,
      pergunta: 'Como cancelar um pedido?',
      resposta: 'Para cancelar um pedido, acesse a seção "Meus Pedidos"...'
    },
    {
      id: 2,
      pergunta: 'Como alterar minha unidade ou restaurante?',
      resposta: 'Você pode alterar sua unidade ou restaurante...'
    },
    {
      id: 3,
      pergunta: 'Qual o prazo para reembolso?',
      resposta: 'Após a confirmação do cancelamento do pedido...'
    },
    {
      id: 4,
      pergunta: 'Como adicionar métodos de pagamento?',
      resposta: 'Acesse o menu "Perfil", selecione "Métodos de Pagamento"...'
    },
    {
      id: 5,
      pergunta: 'Posso fazer pedidos para retirada?',
      resposta: 'Sim! Ao finalizar seu pedido, selecione a opção...'
    }
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const irParaInicio = () => {
    router.replace('/(tabs)/home');
  };

  const toggleItem = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView contentContainerStyle={estilos.scrollContainer} showsVerticalScrollIndicator={false}>

        <View style={estilos.fundoTopo} />

        <TouchableOpacity onPress={irParaInicio} style={estilos.botaoVoltar}>
          <Text style={estilos.textoVoltar}>← Voltar</Text>
        </TouchableOpacity>

        <View style={estilos.cabecalhoContainer}>
          <View style={estilos.iconContainer}>
            <Text style={estilos.iconText}>?</Text>
          </View>
          <Text style={estilos.tituloFAQ}>FAQ</Text>
        </View>

        <View style={estilos.faqContainer}>
          {faqItems.map((item) => {
            const isExpanded = expandedItems[item.id];
            return (
              <Animated.View key={item.id} style={[estilos.faqItemContainer, { opacity: fadeAnim }]}>
                <TouchableOpacity
                  style={estilos.perguntaContainer}
                  onPress={() => toggleItem(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={estilos.perguntaTexto}>
                    {isExpanded ? '↓' : '→'} {item.pergunta}
                  </Text>
                </TouchableOpacity>

                {isExpanded && (
                  <Animated.View style={estilos.respostaContainer}>
                    <Text style={estilos.respostaTexto}>{item.resposta}</Text>
                  </Animated.View>
                )}
              </Animated.View>
            );
          })}
        </View>

        <View style={estilos.contatoContainer}>
          <Text style={estilos.contatoTitulo}>Ainda tem dúvidas?</Text>
          <TouchableOpacity style={estilos.botaoContato}>
            <Text style={estilos.textoBotaoContato}>Fale Conosco</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 48,
  },
  botaoVoltar: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  textoVoltar: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  fundoTopo: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: '#78aeb4',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: -1,
  },
  cabecalhoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 24,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  tituloFAQ: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  faqContainer: {
    width: '100%',
    marginTop: 20,
  },
  faqItemContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  perguntaContainer: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
  },
  perguntaTexto: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  respostaContainer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#F5F5F5',
  },
  respostaTexto: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    textAlign: 'center',
  },
  contatoContainer: {
    marginTop: 32,
    alignItems: 'center',
    width: '100%',
  },
  contatoTitulo: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  botaoContato: {
    backgroundColor: '#78aeb4',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  textoBotaoContato: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});