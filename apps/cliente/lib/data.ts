const API_URL = process.env.EXPO_PUBLIC_API_URL;
import { fetch } from 'expo/fetch';
import axios from "axios";

export async function fazerLogin(loginForm : FormData){
  let req = await axios.post(API_URL + "/login",{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: loginForm
  })
  console.log(await req.data);
}

export async function fazerCadastro(username : string, password : string){
  let req = await axios.post(`${API_URL}/cadastro`, {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "username" : username,
      "password" : password
    })
  });
  console.log(await req.data);

}
