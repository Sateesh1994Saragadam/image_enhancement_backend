import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import Replicate from "replicate";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post("/img_answering", async (req, res) => {
  const fileUrl = req.body.fileUrl;
  const prompt = req.body.prompt;
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const model = "joehoover/instructblip-vicuna13b:c4c54e3c8c97cd50c2d2fec9be3b6065563ccf7d43787fb99f84151b867178fe";
  const input = {
    prompt: prompt,
    img: fileUrl,
  };
  const output = await replicate.run(model, { input });

    res.status(200).json({ statusCode: 200, result: output });
});

app.post("/img_enhancer", async (req, res) => {
    const fileUrl = req.body.fileUrl;

    console.log(fileUrl, "file");
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