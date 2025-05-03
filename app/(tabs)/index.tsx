import React from 'react';
import { Image, StyleSheet, SafeAreaView, TouchableOpacity, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function TelaBoasVindas() {
  const router = useRouter();

  const irParaLogin = () => {
    router.push('/login');
  };

  const irParaCadastro = () => {
    router.push('/cadastro');
  };

  const continuarSemLogin = () => {
    router.replace('/(tabs)/inicio'); 
  };

  return (
    <SafeAreaView style={estilos.container}>
      {/* Logo do aplicativo */}
      <View style={estilos.logoContainer}>
        <Image 
          source={require('@/assets/images/Robo.png')} 
          style={estilos.logo}
          resizeMode="contain"
        />
      </View>

      {/* Nome do aplicativo */}
      <Text style={estilos.nomeApp}>PoliChat</Text>

      {/* Texto de boas-vindas */}
      <Text style={estilos.textoBoasVindas}>Bem-vindo!</Text>

      {/* Botões */}
      <View style={estilos.containerBotoes}>
        <TouchableOpacity style={estilos.botao} onPress={irParaLogin}>
          <Text style={estilos.textoBotao}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.botao} onPress={irParaCadastro}>
          <Text style={estilos.textoBotao}>Cadastre-se</Text>
        </TouchableOpacity>
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
    width: 150,
    height: 150,
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
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
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
    marginTop: -5,
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
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  logoEscola: {
    width: '100%',
    height: '100%',
  },
});