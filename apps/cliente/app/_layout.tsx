// app/_layout.js
import { Slot, useRouter, usePathname } from 'expo-router';
import { View, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import React from 'react';

export default function Layout() {
  const router = useRouter();
  const pathname = usePathname();

  const irPara = (rota) => {
    router.push(rota);
  };

  const mostrarBarra = !['/login', '/', '/selecionaunidade', '/cadastro'].includes(pathname);

  return (
    <View style={{ flex: 1 }}>
      <Slot />

      {mostrarBarra && (
        <SafeAreaView style={styles.containerBarra}>
          <View style={styles.barraNavegacao}>
            <TouchableOpacity
              style={styles.botaoNavegacao}
              onPress={() => irPara('/(tabs)/chat')}
            >
              <Feather
                name="message-circle"
                size={24}
                color={pathname === '/chat' ? '#78aeb4' : '#666'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoNavegacao}
              onPress={() => irPara('/home')}
            >
              <Feather
                name="home"
                size={24}
                color={pathname === '/home' ? '#78aeb4' : '#666'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoNavegacao}
              onPress={() => irPara('/configuracoes')}
            >
              <Feather
                name="settings"
                size={24}
                color={pathname === '/configuracoes' ? '#78aeb4' : '#666'}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerBarra: {
    backgroundColor: '#fff',
  },
  barraNavegacao: {
    height: 60,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  botaoNavegacao: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
});