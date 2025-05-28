import React, { useRef, useEffect, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function TelaConfiguracao() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [preferencias, setPreferencias] = useState("");
  const [restricoes, setRestricoes] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [senhaErro, setSenhaErro] = useState("");
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleTelefoneChange = (text: string) => {
    const onlyNumbers = text.replace(/[^0-9]/g, '');
    setTelefone(onlyNumbers);
  };

  const handleSalvar = () => {
    if (!email.trim() || !telefone.trim()) {
      setSenhaErro("Preencha todos os campos obrigatórios.");
      return;
    }
    if (password && password !== confirmPassword) {
      setSenhaErro("As senhas não coincidem.");
      return;
    }
    setSenhaErro("");
    Alert.alert("Configurações salvas com sucesso!");
  };

  const handleSair = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: () => router.replace('/') },
      ]
    );
  };
  

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView contentContainerStyle={estilos.scrollContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={estilos.botaoVoltar}>
          <Text style={estilos.textoVoltar}>← Voltar</Text>
        </TouchableOpacity>

        <Animated.View style={{ ...estilos.logoContainer, opacity: fadeAnim }}>
          <Image
            source={require('@/assets/images/Robo2.png')}
            style={estilos.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, marginBottom: 24 }}>
          <Text style={estilos.titulo}>Configurações</Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={estilos.formGroup}>
            <Text style={estilos.label}>Telefone</Text>
            <TextInput
              placeholder="(00) 00000-0000"
              style={estilos.input}
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={handleTelefoneChange}
              placeholderTextColor="#aaa"
              maxLength={11}
              editable={editando}
            />
          </View>

          <View style={estilos.formGroup}>
            <Text style={estilos.label}>E-mail</Text>
            <TextInput
              placeholder="seunome@email.com"
              style={estilos.input}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#aaa"
              editable={editando}
            />
          </View>

          <View style={estilos.formGroup}>
            <Text style={estilos.label}>Senha</Text>
            <TextInput
              placeholder="*******"
              style={estilos.input}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#aaa"
              editable={editando}
            />
            <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={{ marginTop: 6 }}>
              <Text style={{ color: '#78aeb4', fontWeight: 'bold' }}>
                {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={estilos.formGroup}>
            <Text style={estilos.label}>Confirmar Senha</Text>
            <TextInput
              placeholder="*******"
              style={estilos.input}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#aaa"
              editable={editando}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(v => !v)} style={{ marginTop: 6 }}>
              <Text style={{ color: '#78aeb4', fontWeight: 'bold' }}>
                {showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={estilos.formGroup}>
            <Text style={estilos.label}>Preferências Alimentares</Text>
            <TextInput
              placeholder="Conte seus pratos favoritos, gostos e preferências..."
              style={[estilos.input, estilos.inputLongo]}
              multiline
              value={preferencias}
              onChangeText={setPreferencias}
              placeholderTextColor="#aaa"
              editable={editando}
            />
          </View>

          <View style={estilos.formGroup}>
            <Text style={estilos.label}>Restrições Alimentares</Text>
            <TextInput
              placeholder="Alguma alergia ou alimento que evita?"
              style={[estilos.input, estilos.inputLongo]}
              multiline
              value={restricoes}
              onChangeText={setRestricoes}
              placeholderTextColor="#aaa"
              editable={editando}
            />
          </View>
        </Animated.View>

        {senhaErro ? (
          <Text style={{ color: 'red', marginBottom: 10, alignSelf: 'flex-start' }}>{senhaErro}</Text>
        ) : null}

        {!editando ? (
          <TouchableOpacity style={estilos.botao} onPress={() => setEditando(true)}>
            <Text style={estilos.textoBotao}>Editar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={estilos.botao} onPress={() => {
            Alert.alert(
              "Salvar Alterações",
              "Deseja salvar as alterações feitas?",
              [
                { text: "Cancelar", style: "cancel" },
                { text: "Salvar", onPress: handleSalvar }
              ]
            );
            setEditando(false);
          }}>
            <Text style={estilos.textoBotao}>Salvar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[estilos.botao, { backgroundColor: '#e57373', marginTop: 12 }]}
          onPress={handleSair}
        >
          <Text style={estilos.textoBotao}>Sair</Text>
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
  titulo: {
    fontSize: 28,
    fontWeight: '600',
    color: '#78aeb4',
    textAlign: 'center',
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
  botao: {
    backgroundColor: '#78aeb4',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
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
});