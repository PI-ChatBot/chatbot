import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Href, useRouter } from 'expo-router';

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
          onPress={() => irPara('/pedido')}
          style={estilos.botaoPedido}
          activeOpacity={0.8}
        >
          <Text style={estilos.textoBotaoPedido}>Quero realizar meu pedido</Text>
          <Image source={require('@/assets/images/Robo2.png')} style={estilos.iconBotaoGrande} />
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
            <Image source={require('@/assets/images/garfofaca.png')} style={estilos.iconeBloco} />
            <Text style={estilos.textoBloco}>cardápio</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.bloco} onPress={() => irPara('/promocoes')}>
            <Image source={require('@/assets/images/promos.png')} style={estilos.iconeBloco} />
            <Text style={estilos.textoBloco}>promos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.bloco} onPress={() => irPara('/funcionamento')}>
            <Image source={require('@/assets/images/relogio.png')} style={estilos.iconeBloco} />
            <Text style={estilos.textoBloco}>funcionamento</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.bloco} onPress={() => irPara('/faq')}>
            <Image source={require('@/assets/images/info.png')} style={estilos.iconeBloco} />
            <Text style={estilos.textoBloco}>FAQ</Text>
          </TouchableOpacity>
        </View>
        {/* Botão Flutuante - Robô */}
        <TouchableOpacity
          style={estilos.roboBotao}
          onPress={() => irPara('/pedido')}
          activeOpacity={0.7}
        >
          <View style={estilos.circuloRobo}>
            <Image source={require('@/assets/images/Robo2.png')} style={estilos.imgRoboMelhor} />
          </View>
        </TouchableOpacity>
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
    marginTop: 16,
    color: '#ffffff',
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
    marginTop: 16,
  },
  iniciaisUsuario: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statusOnline: {
    width: 10,
    height: 10,
    backgroundColor: '#2ecc71',
    borderRadius: 5,
    position: 'absolute',
    bottom: 2,
    right: 2,
    borderWidth: 1,
    borderColor: '#fff',
  },
  botaoPedido: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  textoBotaoPedido: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },
  iconBotaoGrande: {
    width: 36,
    height: 36,
    marginLeft: 8,
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
  roboBotao: {
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 16,
  },
  circuloRobo: {
    width: 80,
    height: 80,
    backgroundColor: '#faa41f',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  imgRoboMelhor: {
    width: 65,
    height: 75,
    borderRadius: 27,
    overflow: 'hidden',
  },
});
