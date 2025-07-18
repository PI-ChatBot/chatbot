import React, { useRef, useEffect, useState } from 'react';
import { Animated, Image, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { fazerLogin } from '@/lib/data';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function TelaLogin() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const [lembrarSenha, setLembrarSenha] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    try {
      let data: { token: string, nome: string } = await fazerLogin(email, senha);
      console.log(data);
      if (data["token"] && data["nome"]) {
        await AsyncStorage.setItem("token", data["token"]);
        await AsyncStorage.setItem("nome", data["nome"]);
        router.replace("/(tabs)/home");
      }
      else{
        Alert.alert(
          "Erro",
          "Houve um erro na hora de fazer login",
          [
            {
              text: "OK",
              onPress: () => {}
            }
          ]
        )
      }
    } catch (e) {
    }
  }

  const irParaInicio = () => {
    router.replace('/(tabs)/home');
  };

  const toggleLembrarSenha = () => {
    setLembrarSenha(!lembrarSenha);
  };

  const isFormValid = email.trim() !== '' && senha.trim() !== '';

  return (
      <SafeAreaView style={estilos.container
      } >
        <View style={estilos.scrollContainer}>
          <TouchableOpacity onPress={() => router.back()} style={estilos.botaoVoltar}>
            <Text style={estilos.textoVoltar}>← Voltar</Text>
          </TouchableOpacity>

          <View style={estilos.innerContainer}>
            <Animated.View style={{ ...estilos.logoContainer, opacity: fadeAnim }}>
              <Image
                source={require('@/assets/images/Robo2.png')}
                style={estilos.logo}
                resizeMode="contain"
              />
            </Animated.View>

            <Text style={estilos.titulo}>Entrar</Text>

            <View style={estilos.formGroup}>
              <Text style={estilos.label}>E-mail</Text>
              <TextInput
                placeholder="seunome@email.com"
                style={estilos.input}
                keyboardType="email-address"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={estilos.formGroup}>
              <Text style={estilos.label}>Senha</Text>
              <TextInput
                placeholder="Digite sua senha"
                style={estilos.input}
                secureTextEntry={!mostrarSenha}
                placeholderTextColor="#aaa"
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity onPress={() => setMostrarSenha(v => !v)} style={{ marginTop: 6 }}>
                <Text style={{ color: '#78aeb4', fontWeight: 'bold' }}>
                  {mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Checkbox: lembrar senha */}
            <TouchableOpacity style={estilos.checkboxContainer} onPress={toggleLembrarSenha}>
              <View style={[estilos.checkbox, lembrarSenha && estilos.checkboxMarcado]}>
                {lembrarSenha && <Text style={estilos.checkboxX}>✓</Text>}
              </View>
              <Text style={estilos.labelCheckbox}>Lembrar minha senha</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[estilos.botao, !isFormValid && { backgroundColor: '#ccc' }]}
              onPress={handleLogin}
              disabled={!isFormValid}
            >
              <Text style={estilos.textoBotao}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/recuperarsenha')}>
              <Text style={estilos.textoRecuperarSenha}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView >);
}


const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
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
  innerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
    width: '80%',
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxMarcado: {
    backgroundColor: '#78aeb4',
    borderColor: '#78aeb4',
  },
  checkboxX: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  labelCheckbox: {
    fontSize: 16,
    color: '#333',
  },
  botao: {
    backgroundColor: '#78aeb4',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  textoRecuperarSenha: {
    fontSize: 14,
    color: '#78aeb4',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 16,
  },
});
