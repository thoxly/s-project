// api/knowledgeApi.js
import administrativedata from '../mock/administrativedata.json';

export const fetchKnowledgeData = async () => {
  // Имитация API-запроса
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(administrativedata);
    }, 500);
  });
};

// TODO: Реализовать при наличии backend
// export const addKnowledgeFromElma = async (data) => {
//   const response = await fetch('https://<домен_портала>/api/knowledge', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   return response.json();
// };