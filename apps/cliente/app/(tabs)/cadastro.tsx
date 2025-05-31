import React, {useRef, useEffect, useState} from 'react';
import { Animated, Image, SafeAreaView, StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { fazerCadastro } from '@/lib/data';

export default function TelaCadastro() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const [primeiroNome, setPrimeiroNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [senhaErro, setSenhaErro] = useState("");

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

  // Permite apenas números no telefone
  const handleTelefoneChange = (text: string) => {
    const onlyNumbers = text.replace(/[^0-9]/g, '');
    setTelefone(onlyNumbers);
  };

  const handleCadastro = async () => {
    if (
      !primeiroNome.trim() ||
      !sobrenome.trim() ||
      !telefone.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setSenhaErro("Preencha todos os campos obrigatórios corretamente.");
      return;
    }
    if (password !== confirmPassword) {
      setSenhaErro("As senhas não coincidem.");
      return;
    }
    if (!/^\d+$/.test(telefone)) {
      setSenhaErro("O telefone deve conter apenas números.");
      return;
    }
    setSenhaErro("");
    try {
      await fazerCadastro(primeiroNome,sobrenome,new Date(dataNascimento),"cliente",telefone,email,password);
      Alert.alert(
        "Conta criada com sucesso",
        "Sua conta foi criada!",
        [
          {
            text: "OK",
            onPress: () => router.replace('/(tabs)'),
          },
        ],
        { cancelable: false }
      );
    } catch (e) {
      setSenhaErro("Erro ao criar conta. Tente novamente.");
    }
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
            value={primeiroNome}
            onChangeText={setPrimeiroNome}
          />
        </View>

        <View style={estilos.formGroup}>
          <Text style={estilos.label}>Sobrenome</Text>
          <TextInput
            placeholder="Digite seu sobrenome"
            style={estilos.input}
            placeholderTextColor="#aaa"
            value={sobrenome}
            onChangeText={setSobrenome}
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
            value={telefone}
            onChangeText={handleTelefoneChange}
            maxLength={11}
          />
        </View>

        <View style={estilos.formGroup}>
          <Text style={estilos.label}>Data Nascimento</Text>
          <TextInput
          placeholder="YYYY-MM-DD"
          style={estilos.input}
          keyboardType="default"
          placeholderTextColor="#aaa"
          value={dataNascimento}
          onChangeText={setDataNascimento}

          maxLength={11}
          />
        </View>

        <View style={estilos.formGroup}>
          <Text style={estilos.label}>E-mail Institucional</Text>
          <TextInput
            placeholder="seunome@email.com"
            value={email}
            onChangeText={setEmail}
            style={estilos.input}
            keyboardType="email-address"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={estilos.formGroup}>
          <Text style={estilos.label}>Senha</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder='*******'
            style={estilos.input}
            secureTextEntry={!showPassword}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={{ marginTop: 6 }}>
            <Text style={{ color: '#78aeb4', fontWeight: 'bold' }}>
              {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={estilos.formGroup}>
          <Text style={estilos.label}>Confirmar senha</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder='*******'
            style={estilos.input}
            secureTextEntry={!showConfirmPassword}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(v => !v)} style={{ marginTop: 6 }}>
            <Text style={{ color: '#78aeb4', fontWeight: 'bold' }}>
              {showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
            </Text>
          </TouchableOpacity>
        </View>

        {senhaErro ? (
          <Text style={{ color: 'red', marginBottom: 10, alignSelf: 'flex-start' }}>{senhaErro}</Text>
        ) : null}

        <TouchableOpacity
          style={estilos.botao}
          onPress={handleCadastro}
        >
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
