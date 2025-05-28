import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'; // Adicione esta linha

export default function TelaHome() {
  const router = useRouter();

  const irPara = (rota : Href) => {
    router.push(rota);
  };

  return (
    <SafeAreaView style={estilos.container}>
      {/* Fundo azul com bordas arredondadas */}
      <View style={estilos.fundoAzul} />

      <View style={estilos.conteudo}>
        {/* Header */}
        <View style={estilos.topo}>
          <View>
            <Text style={estilos.local}>Vila Mariana, São Paulo</Text>
            <Text style={estilos.nomeLoja}>PoliLanches</Text>
          </View>

          <TouchableOpacity onPress={() => irPara('/configuracoes')} style={estilos.fotoUsuario}>
            <Text style={estilos.iniciaisUsuario}>JD</Text>
            <View style={estilos.statusOnline} />
          </TouchableOpacity>
        </View>

        <Text style={estilos.saudacao}>Olá, Mateus</Text>

        <TouchableOpacity
          onPress={() => irPara('/(tabs)/chat')}
          style={estilos.botaoPedido}
          activeOpacity={0.8}
        >
          <Text style={estilos.textoBotaoPedido}>Quero realizar meu pedido</Text>
          <View style={{ 
            borderRadius: 0, 
            overflow: 'visible', 
            backgroundColor: '#fff', 
            marginLeft: 2, 
            marginTop: -7,
            marginBottom: -12 // desce um pouco o robô
          }}>
            <Image
              source={require('@/assets/images/headrobo.png')}
              style={{ width: 45, height: 43, marginRight: 20 }}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>

        {/* Status do pedido */}
        <View style={estilos.cardStatus}>
          <View style={estilos.etiquetaAgora}>
            <Text style={estilos.textoAgora}>agora</Text>
          </View>
          <Text style={estilos.statusTexto}>Seu pedido está sendo preparado</Text>
        </View>

        {/* Blocos de Acesso */}
        <View style={estilos.blocos}>
          <TouchableOpacity style={estilos.bloco} onPress={() => irPara('/cardapio')}>
            <MaterialIcons name="restaurant-menu" size={28} color="#FF7043" style={estilos.iconeBloco} />
            <Text style={estilos.textoBloco}>Cardápio</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.bloco} onPress={() => irPara('/promocoes')}>
            <MaterialIcons name="percent" size={28} color="#faa41f" style={estilos.iconeBloco} />
            <Text style={estilos.textoBloco}>Promoções</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.bloco} onPress={() => irPara('/funcionamento')}>
            <MaterialIcons name="access-time" size={28} color="#4CAF50" style={estilos.iconeBloco} />
            <Text style={estilos.textoBloco}>Funcionamento</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.bloco} onPress={() => irPara('/faq')}>
            <MaterialIcons name="info-outline" size={28} color="#42A5F5" style={estilos.iconeBloco} />
            <Text style={estilos.textoBloco}>FAQ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  fundoAzul: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    backgroundColor: '#78aeb4',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 0,
  },
  conteudo: {
    flex: 1,
    padding: 24,
    zIndex: 1,
    paddingBottom: 80, 
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  local: {
    fontSize: 15,
    color: '#e8f0f2',
  },
  nomeLoja: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  saudacao: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 10,
    color: '#ffffff',
    marginBottom: 10,
  },
  fotoUsuario: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 50,
    marginTop: 48,
    marginBottom: -25
  },
  iniciaisUsuario: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botaoPedido: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },
  textoBotaoPedido: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },
  cardStatus: {
    backgroundColor: '#f5f5f5',
    padding: 18,
    borderRadius: 14,
    marginTop: 16,
  },
  etiquetaAgora: {
    backgroundColor: '#3c915a',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 8,
  },
  textoAgora: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'lowercase',
  },
  statusTexto: {
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
  },
  blocos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 34,
    alignContent: 'center',
    justifyContent: 'center',
  },
  bloco: {
    width: '44%',
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 16,
    height: 120,
    justifyContent: 'center',
  },
  iconeBloco: {
    width: 28,
    height: 28,
    marginBottom: 8,
  },
  textoBloco: {
    fontSize: 17,
    fontWeight: '500',
    color: '#444',
  },
});
