import React, {useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Animated, Image, SafeAreaView, StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { fazerCadastro } from '@/lib/data';

export default function TelaCadastro() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const irParaInicio = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView contentContainerStyle={estilos.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Botão de voltar */}
        <TouchableOpacity onPress={() => router.back()} style={estilos.botaoVoltar}>
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

        <Text style={estilos.titulo}>Criar Conta</Text>

        <View style={estilos.formGroup}>
          <Text style={estilos.label}>Primeiro Nome</Text>
          <TextInput
            placeholder="Como o chatbot deve te chamar?"
            style={estilos.input}
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={estilos.formGroup}>
          <Text style={estilos.label}>Sobrenome</Text>
          <TextInput
            placeholder="Digite seu sobrenome"
            style={estilos.input}
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={estilos.formGroup}>
          <Text style={estilos.label}>Preferências Alimentares</Text>
          <TextInput
            placeholder="Conte seus pratos favoritos, gostos e preferências..."
            style={[estilos.input, estilos.inputLongo]}
            multiline
            placeholderTextColor="#aaa"
          />
          <Text style={estilos.infoTexto}>Essas informações serão usadas para personalizar suas recomendações.</Text>
        </View>

        <View style={estilos.formGroup}>
          <Text style={estilos.label}>Restrições Alimentares</Text>
          <TextInput
            placeholder="Alguma alergia ou alimento que evita?"
            style={[estilos.input, estilos.inputLongo]}
            multiline
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={estilos.formGroup}>
          <Text style={estilos.label}>Telefone</Text>
          <TextInput
            placeholder="(00) 00000-0000"
            style={estilos.input}
            keyboardType="phone-pad"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={estilos.formGroup}>
          <Text style={estilos.label}>E-mail</Text>
          <TextInput
            placeholder="seunome@email.com"
            value={username}
            onChangeText={text => setUsername(text)}
            style={estilos.input}
            keyboardType="email-address"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={estilos.formGroup}>
          <Text style={estilos.label}>Senha</Text>
          <TextInput
            value={password}
            onChangeText={text => setPassword(text)}
            placeholder='*******'
            style={estilos.input}
            keyboardType="visible-password"
            placeholderTextColor="#aaa"
          />
        </View>


        <TouchableOpacity style={estilos.botao} onPress={async () => await fazerCadastro(username, password)}>
          <Text style={estilos.textoBotao}>Criar Conta</Text>
        </TouchableOpacity>
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
    color: '#78aeb4',
    fontWeight: '500',
  },
  logoContainer: {
    width: 90,
    height: 110,
    marginBottom: 16,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  titulo: {
    fontSize: 28,
    fontWeight: '600',
    color: '#78aeb4',
    marginBottom: 24,
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f8f8f8',
  },
  inputLongo: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  infoTexto: {
    fontSize: 12,
    color: '#777',
    marginTop: 6,
  },
  botao: {
    backgroundColor: '#78aeb4',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
