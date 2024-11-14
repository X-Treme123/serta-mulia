const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  // Log untuk menandai proses prediksi
  console.log('Processing prediction...');

  const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);

  // Log untuk memeriksa hasil prediksi
  console.log('Confidence Score:', confidenceScore);
  console.log('Predicted Label:', label);
  console.log('Explanation:', explanation);
  console.log('Suggestion:', suggestion);

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    "id": id,
    "result": label,
    "explanation": explanation,
    "suggestion": suggestion,
    "confidenceScore": confidenceScore,
    "createdAt": createdAt
  };

  // Simpan data ke layanan storeData
  await storeData(id, data);

  const response = h.response({
    status: 'success',
    message: confidenceScore > 99 ? 'Model is predicted successfully.' : 'Model is predicted successfully but under threshold. Please use the correct picture',
    data
  });

  // Log sebelum mengirimkan respons
  console.log('Response to send:', response);

  response.code(201);  // Pastikan kode status ini adalah 201 dan valid
  return response;
}

module.exports = postPredictHandler;