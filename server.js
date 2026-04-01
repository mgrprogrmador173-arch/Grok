require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.post('/api/generate', async (req, res) => {
    const { prompt, model } = req.body;
    
    // Usando o modelo solicitado pelo usuário
    const targetModel = model || "qwen/qwen3.6-plus-preview:free";
    
    console.log(`--- Nova Requisição ---`);
    console.log(`Prompt: ${prompt.substring(0, 50)}...`);
    console.log(`Modelo: ${targetModel}`);

    try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: targetModel,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 2000
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'X-Title': 'Curionauta PRO'
            }
        });

        console.log(`Sucesso! Resposta recebida.`);
        res.json(response.data);
    } catch (error) {
        console.error('--- Erro na OpenRouter ---');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Dados do Erro:', JSON.stringify(error.response.data, null, 2));
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error('Mensagem:', error.message);
            res.status(500).json({ error: { message: error.message } });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Servidor Grok rodando em http://localhost:${PORT}`);
});
