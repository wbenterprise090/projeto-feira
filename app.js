  
      

  const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post('/processar', async (req, res) => {
  try {
    const { nome, idade, cursoDesejado, perguntaAberta, notas, respostas, transicao } = req.body;

    if (!nome ||!idade) {
      return res.status(400).json({ erro: 'Dados do aluno incompletos' });
    }

    const prompt = `Você é IA Maria, orientadora vocacional. Seja objetivo e retorne APENAS JSON válido, sem texto extra.

DADOS DO ALUNO:
Nome: ${nome}
Idade: ${idade}
Transição: ${transicao || 'secundario_medio'}
Curso desejado: ${cursoDesejado || 'Não informado'}
Motivo: ${perguntaAberta || 'Não informado'}
Notas: ${JSON.stringify(notas || {})}
Perfil: ${JSON.stringify(respostas || {})}

REGRAS:
1. Se transicao = "secundario_medio" prioriza cursos técnicos
2. Se transicao = "medio_faculdade" prioriza cursos universitários
3. logica=TI/Engenharia, criativo=Artes/Design, social=Saúde/Educação, pratico=Construção, dinheiro=Negócios
4. Retorne EXATAMENTE 3 objetos no array
5. Compatibilidade: número inteiro 75-98
6. Justificativa: 1 frase curta max 10 palavras

FORMATO JSON OBRIGATÓRIO:
[{"nome":"Tecnologia da Informação","compat":96,"icon":"laptop-code","cor":"#3b82f6","justificativa":"Nota alta + perfil lógico"}]`;

    const response = await fetch(
      `https://api.groq.com/openai/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GEMINI_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 800
        })
      }
    );

    if (!response.ok) {
      const erroTexto = await response.text();
      console.error('Erro Groq:', erroTexto);
      throw new Error('Erro Groq: ' + response.status);
    }

    const data = await response.json();
    let texto = data.choices[0].message.content;

    // Limpa markdown se vier
    texto = texto.replace(/```json/g, '').replace(/```/g, '').trim();
    let resultado = JSON.parse(texto);

    const infoMercado = transicao === 'secundario_medio'? {
      "Tecnologia da Informação": { salario: "60.000 - 150.000 KZ", demanda: "Muito Alta", cursos: "Técnico de Informática" },
      "Engenharia": { salario: "80.000 - 200.000 KZ", demanda: "Alta", cursos: "Técnico de Construção" },
      "Saúde": { salario: "50.000 - 120.000 KZ", demanda: "Alta", cursos: "Técnico de Enfermagem" },
      "Artes e Design": { salario: "40.000 - 100.000 KZ", demanda: "Média", cursos: "Design Gráfico" },
      "Construção Civil": { salario: "55.000 - 130.000 KZ", demanda: "Alta", cursos: "Técnico de Obras" },
      "Negócios": { salario: "45.000 - 110.000 KZ", demanda: "Média", cursos: "Contabilidade" }
    } : {
      "Tecnologia da Informação": { salario: "80.000 - 250.000 KZ", demanda: "Muito Alta", cursos: "Eng. Informática" },
      "Engenharia": { salario: "120.000 - 400.000 KZ", demanda: "Alta", cursos: "Eng. Civil" },
      "Saúde": { salario: "150.000 - 500.000 KZ", demanda: "Alta", cursos: "Medicina/Enfermagem" },
      "Artes e Design": { salario: "60.000 - 180.000 KZ", demanda: "Média", cursos: "Design/Arquitetura" },
      "Construção Civil": { salario: "100.000 - 300.000 KZ", demanda: "Alta", cursos: "Eng. Civil" },
      "Negócios": { salario: "90.000 - 350.000 KZ", demanda: "Alta", cursos: "Gestão/Economia" }
    };

    resultado = resultado.map(area => ({
     ...area,
      mercado: infoMercado[area.nome] || { salario: "N/A", demanda: "N/A", cursos: "N/A" }
    }));

    res.json({ resultado });

  } catch(error) {
    console.error('Erro:', error);
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
