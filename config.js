module.exports = {
  porta: process.env.PORTA || 9080,
  gemini: {
    modelo: 'gemini-1.5-flash-latest',
    temperatura: 0.3,
    maxTokens: 800
  },
  instituto: 'Instituto Politécnico Prof. Maria Osvalda',
  versao: '2.0.0',
  cores: {
    azul: '#1e3a8a',
    azulClaro: '#3b82f6',
    escuro: '#0f172a'
  }
};