import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { fazerLogin } from "@/lib/data";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      let data: { token: string; restaurantId: string } = await fazerLogin(
        email,
        password,
      );
      console.log(data);
      if (data["token"] && data["restaurantId"]) {
        await AsyncStorage.setItem("token", data["token"]);
        await AsyncStorage.setItem("restaurantId", data["restaurantId"]);
        router.replace("/pedidos");
      } else {
        Alert.alert("Erro", "Houve um erro na hora de fazer login", [
          {
            text: "OK",
            onPress: () => {},
          },
        ]);
      }
    } catch (e) {}
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginBox}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Senha"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
        />
        {errorMessage !== "" && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Logar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  loginBox: {
    width: 400,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)", // só funciona no web
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  successText: {
    marginTop: 20,
    color: "green",
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
});
//   return (
//     <View style={{ padding: 20 }}>
//       <Text>ID do Restaurante:</Text>
//       <TextInput
//         value={restaurantId}
//         onChangeText={setRestaurantId}
//         style={{ borderWidth: 1, marginVertical: 10 }}
//         placeholder="Digite o ID"
//       />
//       <Button title="Entrar" onPress={handleLogin} />
//     </View>
//   );
// }
