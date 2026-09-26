import type { Request, Response, NextFunction } from 'express';

const WEBHOOK = process.env.DISCORD_WEBHOOK_REQUESTS;
const METODOS = (process.env.DISCORD_NOTIFY_METHODS ?? 'GET,POST,PUT,PATCH,DELETE').split(',');
const INTERVALO_MS = 5000;
const MAX_POR_MENSAJE = 10;

type Evento = {
  method: string;
  url: string;
  status: number;
  ms: number;
  ip: string;
  fecha: string;
};

const cola: Evento[] = [];

const iconos: Record<string, string> = {
  GET: '🔵',
  POST: '🟢',
  PUT: '🟠',
  PATCH: '🟠',
  DELETE: '🔴',
};

const colores: Record<string, number> = {
  GET: 0x3498db,
  POST: 0x2ecc71,
  PUT: 0xf39c12,
  PATCH: 0xf39c12,
  DELETE: 0xe74c3c,
};

async function enviarLote(): Promise<void> {
  if (!WEBHOOK || cola.length === 0) return;

  const lote = cola.splice(0, MAX_POR_MENSAJE);
  const embeds = lote.map((e) => ({
    title: `${iconos[e.method] ?? '⚪'} ${e.method} ${e.url}`,
    description: `Estado: **${e.status}** · ${e.ms} ms · IP: ${e.ip}`,
    color: e.status >= 400 ? 0xe74c3c : colores[e.method] ?? 0x95a5a6,
    timestamp: e.fecha,
  }));

  try {
    const res = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds }),
    });
    if (res.status === 429) cola.unshift(...lote); // Discord pidió esperar: reintenta en el próximo ciclo
  } catch (err) {
    console.error('No se pudo notificar a Discord:', (err as Error).message);
  }
}

setInterval(enviarLote, INTERVALO_MS).unref();

export function discordNotifier(req: Request, res: Response, next: NextFunction): void {
  const ignorar =
    !WEBHOOK ||
    !METODOS.includes(req.method) ||
    !req.originalUrl.startsWith('/api/') ||
    req.headers['x-monitor'] !== undefined;

  if (ignorar) return next();

  const inicio = Date.now();

  res.on('finish', () => {
    cola.push({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      ms: Date.now() - inicio,
      ip: (req.headers['x-real-ip'] as string) ?? req.ip ?? 'desconocida',
      fecha: new Date().toISOString(),
    });
    if (cola.length > 200) cola.splice(0, cola.length - 200); // evita acumular memoria si Discord no responde
  });

  next();
}