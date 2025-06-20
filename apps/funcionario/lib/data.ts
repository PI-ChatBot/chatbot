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
  id_item: string | null;
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

export async function editarPrato(token: string, itemCardapio: ItemCardapio) {
  let req = await axios.put(`${API_URL}/cozinha/cardapio`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
      id: itemCardapio.id_item,
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

export async function deletarPrato(token: string, itemCardapioId: string) {
  let req = await axios.delete(`${API_URL}/cozinha/cardapio`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      token: token,
      id: itemCardapioId,
    }),
  });
  return await req.data;
}

export async function obterPedidos(token: string) {
  let req = await axios.get(`${API_URL}/cozinha/pedidos`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  return await req.data;
}

export async function atualizarPedidos(
  token: string,
  id_pedido: string,
  modalType: string,
) {
  let status = "";
  if (modalType === "concluir") {
    status = "entregue";
  } else {
    status = "cancelado";
  }
  let req = await axios.put(`${API_URL}/cozinha/pedidos`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
      id_pedido: id_pedido,
      novo_status: status,
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
