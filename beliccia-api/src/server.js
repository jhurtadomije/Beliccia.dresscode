import app from './app.js';
import { config } from './config/env.js';

app.listen(config.port, () => {
  console.log(`Beliccia API escuchando en puerto ${config.port}`);
});
