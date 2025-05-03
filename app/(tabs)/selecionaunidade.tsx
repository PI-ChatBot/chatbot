import React, { useRef, useEffect, useState } from 'react';
import { Animated, Image, SafeAreaView, StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';

export default function TelaUnidade() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const [unidadeSelecionada, setUnidadeSelecionada] = useState('');
  const [restauranteSelecionado, setRestauranteSelecionado] = useState('');
  const [restaurantesDisponiveis, setRestaurantesDisponiveis] = useState<string[]>([]);
  const [unidadeModalVisivel, setUnidadeModalVisivel] = useState(false);
  const [restauranteModalVisivel, setRestauranteModalVisivel] = useState(false);

  const podeContinuar = unidadeSelecionada !== '' && restauranteSelecionado !== '';

  const handleContinuar = () => {
    if (podeContinuar) {
      // redirecionar para próxima etapa
      router.push('');
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const irParaInicio = () => {
    router.replace('/(tabs)');
  };

  const unidades = ['Unidade Campinas', 'Unidade São José', 'Unidade São Paulo'];
  const restaurantesPorUnidade: { [key: string]: string[] } = {
    'Unidade Campinas': ['Cantina da Lu', 'Lanches Rápidos'],
    'Unidade São José': ['Refeições do Zé', 'Veggie Time'],
    'Unidade São Paulo': ['Restaurante da Vila', 'Pão & Ponto'],
  };

  const selecionarUnidade = (unidade: string) => {
    setUnidadeSelecionada(unidade);
    setRestaurantesDisponiveis(restaurantesPorUnidade[unidade]);
    setRestauranteSelecionado('');
    setUnidadeModalVisivel(false);
  };

  const selecionarRestaurante = (restaurante: string) => {
    setRestauranteSelecionado(restaurante);
    setRestauranteModalVisivel(false);
  };

  const BotaoAnimado = ({ onPress, titulo, desabilitado }: { onPress: () => void, titulo: string, desabilitado?: boolean }) => {
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 0.96,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const onPressOut = () => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={[estilos.botaoContinuar, desabilitado && estilos.botaoDesabilitado]}
          activeOpacity={1}
          disabled={desabilitado}
        >
          <Text style={estilos.textoBotao}>{titulo}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView contentContainerStyle={estilos.scrollContainer} showsVerticalScrollIndicator={false}>

        <View style={estilos.fundoTopo} />

        {/* Botão de voltar */}
        <TouchableOpacity onPress={irParaInicio} style={estilos.botaoVoltar}>
          <Text style={estilos.textoVoltar}>← Voltar</Text>
        </TouchableOpacity>

        {/* Logo do robô */}
        <Animated.View style={{ ...estilos.logoContainer, opacity: fadeAnim }}>
          <Image 
            source={require('@/assets/images/Robo2.png')} 
            style={estilos.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Text style={estilos.titulo}>Antes de começarmos...</Text>

        {/* Seleção da Unidade */}
        <View style={estilos.formGroup}>
          <Text style={estilos.label}>Selecione a Unidade</Text>
          <TouchableOpacity onPress={() => setUnidadeModalVisivel(true)} style={estilos.inputPequeno}>
            <Text style={{ color: unidadeSelecionada ? '#333' : '#aaa' }}>
              {unidadeSelecionada || 'Toque para escolher a unidade'}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal transparent visible={unidadeModalVisivel} animationType="fade">
          <TouchableWithoutFeedback onPress={() => setUnidadeModalVisivel(false)}>
            <View style={estilos.modalOverlay}>
              <Animated.View style={[estilos.modalContainer, { opacity: fadeAnim }]}> 
                {unidades.map((unidade, index) => (
                  <TouchableOpacity key={index} onPress={() => selecionarUnidade(unidade)} style={estilos.opcaoModal}>
                    <Text style={estilos.textoOpcao}>{unidade}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Seleção do Restaurante */}
        <View style={estilos.formGroup}>
          <Text style={estilos.label}>Selecione o Restaurante</Text>
          <TouchableOpacity 
            onPress={() => unidadeSelecionada && setRestauranteModalVisivel(true)}
            style={[estilos.inputPequeno, { backgroundColor: unidadeSelecionada ? '#f8f8f8' : '#e0e0e0' }]}
            disabled={!unidadeSelecionada}
          >
            <Text style={{ color: restauranteSelecionado ? '#333' : '#aaa' }}>
              {restauranteSelecionado || (unidadeSelecionada ? 'Toque para escolher' : 'Escolha a unidade primeiro')}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal transparent visible={restauranteModalVisivel} animationType="fade">
          <TouchableWithoutFeedback onPress={() => setRestauranteModalVisivel(false)}>
            <View style={estilos.modalOverlay}>
              <Animated.View style={[estilos.modalContainer, { opacity: fadeAnim }]}> 
                {restaurantesDisponiveis.map((restaurante, index) => (
                  <TouchableOpacity key={index} onPress={() => selecionarRestaurante(restaurante)} style={estilos.opcaoModal}>
                    <Text style={estilos.textoOpcao}>{restaurante}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <View style={{ marginTop: 20, width: '100%' }}>
          <BotaoAnimado onPress={handleContinuar} titulo="Continuar" desabilitado={!podeContinuar} />
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
  logoContainer: {
    width: 90,
    height: 110,
    marginBottom: 18,
    marginTop: 24,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  titulo: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 80,
  },
  formGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  inputPequeno: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f8f8f8',
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    elevation: 5,
  },
  opcaoModal: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  textoOpcao: {
    fontSize: 16,
    color: '#333',
  },
  fundoTopo: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: '#78aeb4',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: -1,
  },
  botaoContinuar: {
    backgroundColor: '#78aeb4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  botaoDesabilitado: {
    backgroundColor: '#ccc',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});