const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/index3/processar', (req, res) => {
    const { respostas, nome = 'Aluno', idade = 0 } = req.body;

    // LÓGICA: 0=Tech, 1=Criativo, 2=Social, 3=Prático
    const scores = [0, 0, 0, 0];
    respostas.forEach(r => scores[r]++);

    const areas = [
        {nome: "Informática/Programação", curso: "Técnico de Informática", just: "Tens perfil lógico e analítico. Gostas de resolver problemas com dados e tecnologia."},
        {nome: "Design/Artes", curso: "Design Gráfico", just: "Tens perfil criativo e inovador. Gostas de criar coisas novas e expressar ideias."},
        {nome: "Saúde/Enfermagem", curso: "Técnico de Enfermagem", just: "Tens perfil social e de ajuda. Gostas de cuidar e impactar vidas."},
        {nome: "Construção/Mecânica", curso: "Construção Civil", just: "Tens perfil prático e executor. Gostas de construir e trabalhar com as mãos."}
    ];

    const idx_top = scores.indexOf(Math.max(...scores));
    const top_area = areas[idx_top];

    let compat = 70 + scores[idx_top] * 2;
    if(compat > 98) compat = 98;

    const outras = [];
    scores.forEach((score, i) => {
        if(i!== idx_top) {
            outras.push({
                nome: areas[i].nome,
                compat: 60 + score * 2,
                just: areas[i].just,
                curso: areas[i].curso
            });
        }
    });
    outras.sort((a,b) => b.compat - a.compat);

    res.json({resultado: {
        area: top_area.nome,
        compatibilidade: compat,
        descricao: top_area.just,
        curso: top_area.curso,
        outrasAreas: outras.slice(0, 2)
    }});
});

const PORT = 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ MenteBrilhante rodando em http://localhost:${PORT}`);
});
