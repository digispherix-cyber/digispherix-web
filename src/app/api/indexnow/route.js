import { getAllPosts } from '../../../lib/blog'

const KEY = 'a8f3c2e9b4d1f7a0e5c3b9d2f6a1e8c4'
const HOST = 'www.digispherix.com.mx'
const SECRET = process.env.INDEXNOW_SECRET

export async function GET(request) {
  const { searchParams } = new URL(request.url)

  if (searchParams.get('secret') !== SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const posts = getAllPosts()
  const blogUrls = posts.map(p => `https://${HOST}/blog/${p.slug}`)

  const urls = [
    `https://${HOST}/`,
    `https://${HOST}/blog`,
    ...blogUrls,
  ]

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  }

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  })

  return Response.json({
    status: res.status,
    urls,
    message: res.status === 200 || res.status === 202
      ? `✓ ${urls.length} URLs enviadas a IndexNow`
      : 'Error al enviar a IndexNow',
  })
}
