import "module-alias/register";
import http from "http";
import { createApp } from "./app";

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  const app = await createApp();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  server.on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });
}

bootstrap();
