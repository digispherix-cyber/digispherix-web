// Recibe una suscripción del formulario del boletín y la manda a MailerLite.
// El token vive en la variable de entorno MAILERLITE_API_KEY (server-side).
export const runtime = 'nodejs'

export async function POST(req) {
  let body
  try { body = await req.json() } catch { return json({ error: 'Solicitud inválida' }, 400) }

  const { email, consent, website } = body || {}

  // Honeypot: si un bot llenó el campo oculto, fingimos éxito y no hacemos nada.
  if (website) return json({ ok: true })

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Escribe un correo válido.' }, 400)
  if (!consent) return json({ error: 'Debes aceptar recibir correos.' }, 400)

  const key = process.env.MAILERLITE_API_KEY
  if (!key) return json({ error: 'El boletín no está configurado. Intenta más tarde.' }, 500)

  try {
    const r = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    if (r.ok) return json({ ok: true })
    // 422 suele ser correo ya suscrito: lo tratamos como éxito silencioso.
    if (r.status === 422) return json({ ok: true })
    return json({ error: 'No se pudo suscribir. Intenta de nuevo.' }, 502)
  } catch {
    return json({ error: 'No se pudo conectar. Intenta de nuevo.' }, 502)
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}
