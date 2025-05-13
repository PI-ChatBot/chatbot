import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function TelaFuncionamento() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const horarios = [
    { dia: 'Segunda-feira', horario: '08:00 - 18:00' },
    { dia: 'Terça-feira', horario: '08:00 - 18:00' },
    { dia: 'Quarta-feira', horario: '08:00 - 18:00' },
    { dia: 'Quinta-feira', horario: '08:00 - 18:00' },
    { dia: 'Sexta-feira', horario: '08:00 - 18:00' },
    { dia: 'Sábado', horario: '09:00 - 14:00' },
    { dia: 'Domingo', horario: 'Fechado' },
  ];

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

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView
        contentContainerStyle={[estilos.scrollContainer, { paddingTop: insets.top + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.fundoTopo} />

        <TouchableOpacity onPress={irParaInicio} style={estilos.botaoVoltar}>
          <Text style={estilos.textoVoltar}>← Voltar</Text>
        </TouchableOpacity>

        <View style={estilos.cabecalhoContainer}>
          <View style={estilos.iconContainer}>
            <MaterialIcons name="access-time" size={28} color="#fff" />
          </View>
          <Text style={estilos.titulo}>Horários de Funcionamento</Text>
        </View>

        <View style={estilos.horariosContainer}>
          {horarios.map((item, index) => (
            <Animated.View key={index} style={[estilos.horarioItem, { opacity: fadeAnim }]}>
              <Text style={estilos.diaTexto}>{item.dia}</Text>
              <Text style={estilos.horarioTexto}>{item.horario}</Text>
            </Animated.View>
          ))}
        </View>
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
    padding: 24,
    paddingBottom: 48,
  },
  botaoVoltar: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginTop: -60,
  },
  textoVoltar: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  fundoTopo: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    height: 260,
    backgroundColor: '#78aeb4',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: -1,
  },
  cabecalhoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 50,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: -40, 
  },
  titulo: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  horariosContainer: {
    marginTop: 12,
    width: '100%',
  },
  horarioItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  diaTexto: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  horarioTexto: {
    fontSize: 15,
    color: '#555',
  },
});