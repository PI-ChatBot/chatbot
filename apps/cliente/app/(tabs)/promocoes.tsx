import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Image, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

export default function TelaPromocoes() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [produtos, setProdutos] = useState([]);

  const categorias = [
    'Todos',
    'Sobremesas',
    'Pratos Feitos',
    'Salgados',
    'Bebidas',
  ];

  const produtosFiltrados = categoriaAtiva === 'Todos'
    ? produtos
    : produtos.filter(item => item.categoria === categoriaAtiva);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    async function carregarProdutos() {
      const { data, error } = await supabase.from('produtos').select('*');
      if (error) {
        console.error('Erro ao carregar produtos:', error);
      } else {
        setProdutos(data);
      }
    }

    carregarProdutos();
  }, []);

  const irParaInicio = () => {
    router.replace('/(tabs)/home');
  };

  const renderCategoria = ({ item }) => (
    <TouchableOpacity
      style={[
        estilos.categoriaItem,
        categoriaAtiva === item && estilos.categoriaItemAtiva
      ]}
      onPress={() => setCategoriaAtiva(item)}
    >
      <Text
        style={[
          estilos.categoriaTexto,
          categoriaAtiva === item && estilos.categoriaTextoAtiva
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderProduto = ({ item }) => (
    <Animated.View style={[estilos.produtoItem, { opacity: fadeAnim }]}>
      <Image
        source={{ uri: item.imagem }}
        style={estilos.produtoImagem}
        defaultSource={require('assets/images/Robo.png')}
      />
      <Text style={estilos.produtoNome}>{item.nome}</Text>
      <Text style={estilos.produtoPreco}>{item.preco}</Text>
      <Text style={estilos.produtoDescricao}>{item.descricao}</Text>
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
          <MaterialIcons name="percent" size={28} color="#fff" />
        </View>
        <Text style={estilos.titulo}>Promoções</Text>
      </View>

      <View style={estilos.categoriasContainer}>
        <FlatList
          data={categorias}
          renderItem={renderCategoria}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilos.categoriasList}
        />
      </View>

      <FlatList
        data={produtosFiltrados}
        renderItem={renderProduto}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.produtosContainer}
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
  categoriasContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  categoriasList: {
    paddingRight: 16,
  },
  categoriaItem: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    marginRight: 12,
  },
  categoriaItemAtiva: {
    backgroundColor: '#78aeb4',
  },
  categoriaTexto: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  categoriaTextoAtiva: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  produtosContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  produtoItem: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  produtoImagem: {
    width: '100%',
    height: 110,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  produtoNome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  produtoDescricao: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
    textAlign: 'center',
  },
  produtoPreco: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#78aeb4',
    marginBottom: 10, 
  },
});