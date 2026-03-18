import express from 'express';

const app = express();


const PORT = process.env.PORT || 4000;

app.use(express.json());


app.get('/', (req, res) => {
    res.json({
        message: "Mijn eerste backend!",
        success: true
    });
});

app.listen(PORT, () =>{
    console.log(`Server draait op http://localhost:${PORT}`);
});
