export function formatDateTime(date = new Date()) {
  const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const mesesAbreviados = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const diaSemana = diasDaSemana[date.getDay()];
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = mesesAbreviados[date.getMonth()];
  const ano = date.getFullYear();
  const horas = String(date.getHours()).padStart(2, '0');
  const minutos = String(date.getMinutes()).padStart(2, '0');
  const segundos = String(date.getSeconds()).padStart(2, '0');

  return `${diaSemana}, ${dia} de ${mes} | ${horas}:${minutos}`;
}