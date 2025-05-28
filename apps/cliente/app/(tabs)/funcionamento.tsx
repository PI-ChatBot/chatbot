import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, View, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const horarios = [
  { id: '0', dia: 'Domingo', horario: 'Fechado' },
  { id: '1', dia: 'Segunda-feira', horario: '07:00 - 17:00' },
  { id: '2', dia: 'Terça-feira', horario: '07:00 - 17:00' },
  { id: '3', dia: 'Quarta-feira', horario: '07:00 - 17:00' },
  { id: '4', dia: 'Quinta-feira', horario: '07:00 - 17:00' },
  { id: '5', dia: 'Sexta-feira', horario: '07:00 - 17:00' },
  { id: '6', dia: 'Sábado', horario: '09:00 - 14:00' },
];

export default function TelaFuncionamento() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const irParaInicio = () => {
    router.replace('/(tabs)/home');
  };

  const renderHorarioItem = ({ item }) => {
    const diaAtual = new Date().getDay().toString();
    const isHoje = item.id === diaAtual;

    return (
      <View style={[estilos.cardHorario, isHoje && estilos.cardHorarioHoje, estilos.cardHorarioLinha]}>
        <Text style={[estilos.diaTitulo, isHoje && estilos.textoHorarioHoje]}>{item.dia}</Text>
        <Text style={[estilos.horarioDescricao, isHoje && estilos.textoHorarioHoje]}>{item.horario}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={estilos.container}>
      <View style={estilos.fundoTopo} />

      <TouchableOpacity onPress={irParaInicio} style={[estilos.botaoVoltar, { marginTop: insets.top + 24 }]}>
        <Text style={estilos.textoVoltar}>← Voltar</Text>
      </TouchableOpacity>

      <View style={[estilos.cabecalhoContainer, { marginTop: insets.top + 24 }]}>
        <View style={estilos.iconContainer}>
          <MaterialIcons name="access-time" size={28} color="#fff" />
        </View>
        <Text style={estilos.titulo}>Funcionamento</Text>
      </View>

      <FlatList
        data={horarios}
        renderItem={renderHorarioItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.listaHorariosContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  fundoTopo: {
    position: 'absolute',
    top: -190,
    left: 0,
    right: 0,
    height: 430,
    backgroundColor: '#78aeb4',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: -1,
  },
  botaoVoltar: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: 24,
    zIndex: 1,
  },
  textoVoltar: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginTop: -80,
  },
  cabecalhoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12, 
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 110,
    marginTop: -130,
  },
  titulo: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: -100,
    marginBottom: 30,
  },
  listaHorariosContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  cardHorario: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingVertical: 18, // aumentado
    paddingHorizontal: 20, // aumentado
    marginBottom: 16, // aumentado o espaçamento entre os dias
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHorarioLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  diaTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  horarioDescricao: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  cardHorarioHoje: {
    backgroundColor: '#78aeb4',
  },
  textoHorarioHoje: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});