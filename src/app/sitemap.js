import { getAllPosts } from '../lib/blog'
import { tools } from '../lib/tools'

export default function sitemap() {
  const posts = getAllPosts()

  const articles = posts.map(post => ({
    url: `https://digispherix.com.mx/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const toolPages = tools
    .filter(tool => tool.ready)
    .map(tool => ({
      url: `https://digispherix.com.mx/herramientas/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

  return [
    {
      url: 'https://digispherix.com.mx',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://digispherix.com.mx/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://digispherix.com.mx/herramientas',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...toolPages,
    ...articles,
  ]
}
