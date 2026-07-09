import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/admin/login',
          '/trh-staff',
          '/trh-staff/',
          '/access-restricted',
        ],
      },
    ],
  }
}
