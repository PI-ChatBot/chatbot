import React, { useRef, useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const perguntasRespostas = [
  {
    id: '1',
    pergunta: 'O que é este aplicativo?',
    resposta: 'Este aplicativo foi desenvolvido para facilitar o acesso a informações e serviços importantes para nossos usuários.',
  },
  {
    id: '2',
    pergunta: 'Como posso alterar minhas configurações de conta?',
    resposta: 'Vá até o menu "Perfil", selecione "Configurações" e ajuste as preferências conforme desejar.',
  },
  {
    id: '3',
    pergunta: 'O que fazer se o app não estiver funcionando corretamente?',
    resposta: 'Recomendamos fechar e reabrir o app. Se o problema persistir, entre em contato com o suporte.',
  },
  {
    id: '4',
    pergunta: 'O app está disponível para iOS e Android?',
    resposta: 'Sim, o app está disponível para download tanto na App Store quanto no Google Play.',
  },
  {
    id: '5',
    pergunta: 'Como posso enviar feedback?',
    resposta: 'Você pode enviar sugestões e comentários através da opção "Fale Conosco" no menu principal.',
  },
];

export default function TelaFAQ() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [aberta, setAberta] = useState(null);

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

  const renderPergunta = ({ item, index }) => (
    <Animated.View style={[estilos.faqItem, { opacity: fadeAnim }]}>
      <TouchableOpacity onPress={() => setAberta(aberta === item.id ? null : item.id)}>
        <View style={estilos.perguntaContainer}>
          <MaterialIcons name={aberta === item.id ? 'expand-less' : 'expand-more'} size={24} color="#78aeb4" />
          <Text style={estilos.pergunta}>{item.pergunta}</Text>
        </View>
      </TouchableOpacity>
      {aberta === item.id && (
        <Text style={estilos.resposta}>{item.resposta}</Text>
      )}
    </Animated.View>
  );

  return (
    <SafeAreaView style={estilos.container}>
      <View style={estilos.fundoTopo} />

      <TouchableOpacity onPress={irParaInicio} style={[estilos.botaoVoltar, { marginTop: insets.top + 24 }]}>
        <Text style={estilos.textoVoltar}>← Voltar</Text>
      </TouchableOpacity>

      <View style={[estilos.cabecalhoContainer, { marginTop: insets.top + 24 }]}>
        <View style={estilos.iconContainer}>
          <MaterialIcons name="info" size={28} color="#fff" />
        </View>
        <Text style={estilos.titulo}>FAQ</Text>
      </View>

      <FlatList
        data={perguntasRespostas}
        renderItem={renderPergunta}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.faqContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  fundoTopo: {
    position: 'absolute',
    top: -190,
    left: 0,
    right: 0,
    height: 430,
    backgroundColor: '#78aeb4',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: -1,
  },
  botaoVoltar: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: 24,
    zIndex: 1,
  },
  textoVoltar: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginTop: -80,
  },
  cabecalhoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12, 
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 110,
    marginTop: -130,
  },
  titulo: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: -100,
    marginBottom: 30,
  },
  faqContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  faqItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 1,
  },
  perguntaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pergunta: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  resposta: {
    fontSize: 15,
    color: '#555',
    marginTop: 10,
    lineHeight: 22,
  },
});