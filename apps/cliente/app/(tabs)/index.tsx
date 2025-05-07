import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, SafeAreaView, TouchableOpacity, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function TelaBoasVindas() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const irParaLogin = () => {
    router.push('/login');
  };

  const irParaCadastro = () => {
    router.push('/cadastro');
  };

  const continuarSemLogin = () => {
    router.replace('/selecionaunidade');
  };

  const BotaoAnimado = ({ onPress, titulo }: { onPress: () => void, titulo: string }) => {
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
          style={estilos.botao}
          activeOpacity={1}
        >
          <Text style={estilos.textoBotao}>{titulo}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={estilos.container}>
      <Animated.View style={{ ...estilos.logoContainer, opacity: fadeAnim }}>
        <Image 
          source={require('@/assets/images/Robo2.png')} 
          style={estilos.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text style={{ ...estilos.nomeApp, opacity: fadeAnim }}>
        PoliChat
      </Animated.Text>

      <Text style={estilos.textoBoasVindas}>Bem-vindo!</Text>

      <View style={estilos.containerBotoes}>
        <BotaoAnimado onPress={irParaLogin} titulo="Login" />
        <BotaoAnimado onPress={irParaCadastro} titulo="Cadastre-se" />
      </View>

      <Text style={estilos.ouTexto}>ou</Text>
      <TouchableOpacity onPress={continuarSemLogin}>
        <Text style={estilos.continuarSemLogin}>Continuar sem login</Text>
      </TouchableOpacity>

      <View style={estilos.logoEscolaContainer}>
        <Image 
          source={require('@/assets/images/LogoPoliedro.png')} 
          style={estilos.logoEscola}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 100,
    height: 130,
    marginBottom: 24,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  nomeApp: {
    fontSize: 36,
    fontWeight: '600',
    color: '#78aeb4',
    marginBottom: 8,
  },
  textoBoasVindas: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 32,
  },
  containerBotoes: {
    width: '60%',
    paddingHorizontal: 32,
    marginBottom: 3,
  },
  botao: {
    backgroundColor: '#78aeb4',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 30,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  ouTexto: {
    fontSize: 16,
    color: '#888',
    marginVertical: 8,
    textAlign: 'center',
    marginTop: -25,
  },
  continuarSemLogin: {
    fontSize: 16,
    color: '#78aeb4',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 24,
  },
  logoEscolaContainer: {
    width: 160,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  logoEscola: {
    width: '100%',
    height: '100%',
  },
});