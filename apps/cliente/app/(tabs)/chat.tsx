import React, { useRef, useEffect, useState } from 'react';
import { 
  Animated, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Image,
  KeyboardAvoidingView,
  Platform,
  PanResponder,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, MaterialIcons } from '@expo/vector-icons';

// Interface para as mensagens
interface InterfaceMensagem {
  conteudo: string;
  papel: 'usuario' | 'assistente';
}

export default function SalaDeChat() {
  const robotAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [mensagens, setMensagens] = useState<InterfaceMensagem[]>([]);
  const [estaDigitando, setEstaDigitando] = useState<boolean>(false);
  const [textoMensagem, setTextoMensagem] = useState('');

  // Animação do robô quando estiver digitando
  useEffect(() => {
    if (estaDigitando) {
      Animated.timing(robotAnim, {
        toValue: -12,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(robotAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [estaDigitando]);

  useEffect(() => {
    // Scroll para o final quando novas mensagens chegarem
    if (scrollViewRef.current && mensagens.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [mensagens]);

  // Função simulada para chamar API do chatbot
  const chamarAPIChatBot = async (mensagensEntrada: InterfaceMensagem[]) => {
    // Simulação de resposta por enquanto
    return new Promise<InterfaceMensagem>((resolve) => {
      setTimeout(() => {
        resolve({
          conteudo: "Esta é uma resposta simulada do chatbot. Substitua pela sua API real.",
          papel: 'assistente'
        });
      }, 1500);
    });
  };

  const lidarComEnvioMensagem = async () => {
    let mensagem = textoMensagem.trim();
    if (!mensagem) return;

    try {
      // Adicionar a mensagem do usuário à lista de mensagens
      let mensagensEntrada = [...mensagens, { conteudo: mensagem, papel: 'usuario' as const }];

      setMensagens(mensagensEntrada);
      setTextoMensagem('');
      setEstaDigitando(true);

      let mensagemResposta = await chamarAPIChatBot(mensagensEntrada);
      setEstaDigitando(false);
      setMensagens(mensagensAnteriores => [...mensagensAnteriores, mensagemResposta]);

    } catch(erro: any) {
      Alert.alert('Erro', erro.message || 'Erro ao enviar mensagem');
      setEstaDigitando(false);
    }
  };

  // Componente para renderizar cada mensagem
  const renderizarMensagem = (item: InterfaceMensagem, index: number) => (
    <View
      key={index}
      style={[
        estilos.mensagemContainer,
        item.papel === 'usuario' ? estilos.mensagemUsuario : estilos.mensagemAssistente
      ]}
    >
      <Text style={[
        estilos.textoMensagem,
        item.papel === 'usuario' ? estilos.textoUsuario : estilos.textoAssistente
      ]}>
        {item.conteudo}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={estilos.container}>
      <KeyboardAvoidingView 
        style={estilos.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={estilos.fundoTopo} />
        {/* Header */}
        <View style={[estilos.header, { alignItems: 'flex-start', width: '100%' }]}>
          <TouchableOpacity onPress={() => router.back()} style={estilos.botaoVoltar}>
            <Text style={estilos.textoVoltar}>← Voltar</Text>
          </TouchableOpacity>

          <Animated.View style={[
            estilos.logoContainer,
            {
              transform: [{ translateY: robotAnim }]
            }
          ]}>
            <Image
              source={require('@/assets/images/headrobo.png')}
              style={estilos.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Text style={estilos.titulo}>Chatbot</Text>
        </View>

        {/* Área de mensagens */}
        <View style={estilos.chatContainer}>
          {mensagens.length === 0 ? (
            <View style={estilos.mensagemInicial}>
              <Text style={estilos.textoInicial}>
                Olá! Como posso ajudá-lo hoje?
              </Text>
            </View>
          ) : (
            <ScrollView
              ref={scrollViewRef}
              style={estilos.scrollMensagens}
              contentContainerStyle={estilos.scrollContentContainer}
              showsVerticalScrollIndicator={false}
            >
              {mensagens.map((mensagem, index) => renderizarMensagem(mensagem, index))}
              
              {/* Indicador de digitação */}
              {estaDigitando && (
                <View style={[estilos.mensagemContainer, estilos.mensagemAssistente]}>
                  <Text style={[estilos.textoMensagem, estilos.textoAssistente]}>
                    Digitando...
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>

        {/* Input de mensagem */}
        <View style={estilos.inputContainer}>
          <View style={estilos.inputWrapper}>
            <TextInput
              style={estilos.input}
              placeholder="Digite uma mensagem..."
              placeholderTextColor="#aaa"
              value={textoMensagem}
              onChangeText={setTextoMensagem}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[estilos.botaoEnviar, (!textoMensagem.trim() || estaDigitando) && estilos.botaoDesabilitado]}
              onPress={lidarComEnvioMensagem}
              disabled={!textoMensagem.trim() || estaDigitando}
            >
              <Feather 
                name="send" 
                size={20} 
                color={(!textoMensagem.trim() || estaDigitando) ? "#aaa" : "#FFFFFF"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'flex-start',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  botaoVoltar: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginTop: -20,
  },
  textoVoltar: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  logoContainer: {
    width: 70,
    height: 85,
    marginBottom: 12,
    zIndex: 0,
    position: 'relative',
  },
  logo: {
    width: '100%',
    height: '100%',
    marginLeft: 280,
    marginTop: 25,
  },
  titulo: {
    fontSize: 34,
    fontWeight: '600',
    color: '#78aeb4',
    marginTop: -50,
    marginBottom: -12,
    marginLeft: -2,
  },
  menuPopup: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
  menuButton: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  mensagemInicial: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  textoInicial: {
    fontSize: 18,
    color: '#78aeb4',
    textAlign: 'center',
    fontWeight: '500',
  },
  scrollMensagens: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
    paddingBottom: 20,
    paddingTop: 8,
  },
  mensagemContainer: {
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    maxWidth: '80%',
  },
  mensagemUsuario: {
    backgroundColor: '#78aeb4',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 8,
  },
  mensagemAssistente: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textoMensagem: {
    fontSize: 16,
    lineHeight: 22,
  },
  textoUsuario: {
    color: '#FFFFFF',
  },
  textoAssistente: {
    color: '#333',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f8f8',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 8,
  },
  botaoEnviar: {
    backgroundColor: '#78aeb4',
    borderRadius: 20,
    padding: 10,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoDesabilitado: {
    backgroundColor: '#e0e0e0',
  },
  fundoTopo: {
    position: 'absolute',
    zIndex: 0,
    top: -290,
    left: 0,
    right: 0,
    height: 430,
    width: 4300,
    backgroundColor: '#78aeb4',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    transform: [{ scaleY: 0.7 }],
  },
});