import { getAllPosts } from '../lib/blog'

export default function sitemap() {
  const posts = getAllPosts()

  const articles = posts.map(post => ({
    url: `https://digispherix.com.mx/blog/${post.slug}`,
    lastModified: new Date(post.date),
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
    ...articles,
  ]
}
