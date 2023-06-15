import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import Replicate from "replicate";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Add headers to the response
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post("/img_answering", async (req, res) => {
  const fileUrl = req.body.fileUrl;
  const prompt = req.body.prompt;
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const model = "daanelson/minigpt-4:b96a2f33cc8e4b0aa23eacfce731b9c41a7d9466d9ed4e167375587b54db9423";
  const input = {
    prompt: prompt,
    image: fileUrl,
  };
  const output = await replicate.run(model, { input });

    res.status(200).json({ statusCode: 200, result: output });
});

app.post("/img_enhancer", async (req, res) => {
    const fileUrl = req.body.fileUrl;

    console.log(fileUrl, "fileee");
    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
        "tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
        {
          input: {
            img: fileUrl
          }
        }
    );

    res.status(200).json({ statusCode: 200, result: output });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
});