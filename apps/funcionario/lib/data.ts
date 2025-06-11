import axios from "axios";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fazerLogin(email: string, senha: string) {
  let req = await axios.post(`${API_URL}/cozinha/login`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      senha: senha,
    }),
  });
  console.log(await req.data);
  return req.data;
}

export async function obterRestaurante(id_restaurante: string) {
  let req = await axios.post(`${API_URL}/restaurante`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_restaurante: id_restaurante,
    }),
  });
  return await req.data;
}

export async function obterPratos(id_restaurante: string) {
  let req = await axios.post(`${API_URL}/cozinha/pratos`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_restaurante: id_restaurante,
    }),
  });
  return await req.data;
}

export type ItemCardapio = {
  nome: string;
  preco: number;
  descricao: string;
  categoria: string;
  imagem: string | null;
  promocional: boolean;
};

export async function criarPrato(token: string, itemCardapio: ItemCardapio) {
  let req = await axios.post(`${API_URL}/cozinha/cardapio`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
      nome: itemCardapio.nome,
      preco: itemCardapio.preco,
      descricao: itemCardapio.descricao,
      categoria: itemCardapio.categoria,
      imagem: itemCardapio.imagem,
      promocional: itemCardapio.promocional,
    }),
  });
  return await req.data;
}

// export async function fazerCadastro(
//   id_restaurante : number
//   nome : string,
//   email: string,
//   senha: string,
//   funcao : string,
// ) {
//   let req = await axios.post(`${API_URL}/cadastro`, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       primeiro_nome: primeiro_nome,
//       sobrenome: sobrenome,
//       data_nascimento:
//         data_nascimento.getFullYear() +
//         "-" +
//         String(data_nascimento.getMonth() + 1).padStart(2, "0") +
//         "-" +
//         String(data_nascimento.getDate() + 1).padStart(2, "0"),
//       tipo_cliente: tipo_cliente,
//       telefone: telefone,
//       email: email,
//       senha: senha,
//     }),
//   });
//   console.log(await req.data);
// }
