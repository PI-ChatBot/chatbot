const API_URL = process.env.EXPO_PUBLIC_API_URL;
import { Item } from "@/app/(tabs)/chat";
import axios from "axios";

export async function fazerLogin(email: string, senha:string){
  let req = await axios.post(`${API_URL}/login`,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(({
      "email" : email,
      "senha" : senha
    }))
  })
  console.log(await req.data);
  return req.data;
}

export async function fazerCadastro(primeiro_nome:string, sobrenome:string, data_nascimento:Date, tipo_cliente:string, telefone:string, email:string, senha:string){
  let req = await axios.post(`${API_URL}/cadastro`, {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "primeiro_nome" : primeiro_nome,
      "sobrenome":sobrenome,
      "data_nascimento": data_nascimento.getFullYear() + "-" + String((data_nascimento.getMonth() + 1)).padStart(2, "0")+ "-" + String(data_nascimento.getDate() + 1).padStart(2, "0"),
      "tipo_cliente":tipo_cliente,
      "telefone":telefone,
      "email":email,
      "senha" : senha
    })
  });
  console.log(await req.data);

}

export async function enviarPedido(token : string, pedido : Item[]){
  let req = await axios.post(`${API_URL}/pedido`, {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token : token,
      itens : pedido
    })
  });
  console.log(await req.data);
}
