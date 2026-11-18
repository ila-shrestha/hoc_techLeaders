import cors from "cors";
import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", service: "ward16-heritage-api" });
});

app.get("/api/heritage", (_request, response) => {
  response.json({
    data: [],
    message: "Heritage records will be served from PostgreSQL in a later phase.",
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Ward 16 Heritage API listening on port ${port}`);
});
