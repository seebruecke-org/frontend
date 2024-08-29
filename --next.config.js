// const { createClient } = require("urql")
// const runtimeCaching = require("next-pwa/cache")
//
// // const withBundleAnalyzer = require('@next/bundle-analyzer')({
// //   enabled: isProduction()
// // });
// const withPlugins = require("next-compose-plugins")
// // const withPreact = require('next-plugin-preact');
// const withPWA = require("next-pwa")
//
// const { i18n } = require("./next-i18next.config")
//
// function isProduction() {
//   return process.env.NODE_ENV === "production"
// }
//
// function getImageHostnames() {
//   return [process.env.NEXT_PUBLIC_IMAGE_HOSTNAME]
// }
//
// function normalizeRedirect(url) {
//   let normalizedUrl = url
//
//   if (normalizedUrl.startsWith("http")) {
//     return url
//   }
//
//   if (!normalizedUrl.startsWith("/en")) {
//     normalizedUrl = `/de${normalizedUrl}`
//   }
//
//   normalizedUrl = normalizedUrl.replace("?", `\\?`)
//
//   if (normalizedUrl.endsWith("/")) {
//     normalizedUrl = normalizedUrl.replace(/\/$/, "")
//   }
//
//   return normalizedUrl
// }
//
// function getStaticRedirects() {
//   return [
//     {
//       source: "/de/wp-content/:path*",
//       destination: `${process.env.NEXT_PUBLIC_CMS_DOMAIN}/wp-content/:path*`,
//       permanent: true,
//       locale: false
//     },
//
//     {
//       source: "/de/mailman/:path*",
//       destination: "http://mail.seebruecke.org/mailman/:path*",
//       permanent: true,
//       locale: false
//     },
//
//     {
//       source: "/de/uploads/:path*",
//       destination: `${process.env.NEXT_PUBLIC_CMS_DOMAIN}/uploads/:path*`,
//       permanent: true,
//       locale: false
//     }
//   ]
// }
//
// async function fetchCityRedirects() {
//   const generateURI = (city) => {
//     const {
//       slug,
//       is_city_state: isCityState,
//       federal_country: federalCountry
//     } = city
//
//     const prefix = "de/mach-mit"
//     const federalCountrySlug = federalCountry?.slug
//     const countrySlug = federalCountry?.country?.slug
//     let uri = `/${prefix}/${countrySlug}`
//
//     if (isCityState) {
//       uri = `${uri}/${slug}`
//     } else {
//       uri = `${uri}/${federalCountrySlug}/${slug}`
//     }
//
//     return uri
//   }
//
//   const client = createClient({
//     url: process.env.NEXT_PUBLIC_GRAPHQL_API
//   })
//   try {
//     let { cities } = await client
//       .query(
//         `
//     query AllCities {
//       cities(
//         locale: "de",
//         pagination: { pageSize: 100000 }
//       ) {data{
//       attributes{
//         slug
//         is_city_state
//
//
//         federal_country {data{attributes{
//           slug
//
//           country {data{attributes{
//             slug
//           }}}
//         }}}
//       }}}
//     }
//   `
//       )
//       .toPromise()
//       .then(({ data }) => data)
//
//     cities = normalize(cities)
//     const ret = cities.reduce((ret, v) => {
//       ret.push({
//         source: `/de/${v.slug}`,
//         destination: generateURI(v),
//         permanent: false,
//         locale: false
//       })
//       return ret
//     }, [])
//     return ret
//   } catch (e) {
//     console.log(e)
//     return []
//   }
// }
//
// async function fetchAllRedirects() {
//   const client = createClient({
//     url: process.env.NEXT_PUBLIC_GRAPHQL_API
//   })
//
//   try {
//     let { redirects } = await client
//       .query(
//         `
//     query AllRedirects {
//       redirects {data{attributes{
//         from
//         to
//         type
//       }}}
//     }
//   `
//       )
//       .toPromise()
//       .then(({ data }) => data)
//
//     redirects = normalize(redirects)
//
//     if (!redirects) {
//       return []
//     }
//
//     const normalized = redirects.reduce((acc, { from, to, type }) => {
//       let source = normalizeRedirect(from)
//       let destination = normalizeRedirect(to)
//
//       if (!destination) {
//         destination = "/de"
//       }
//
//       const redirect = {
//         source,
//         destination,
//         permanent: type === "permanently",
//         locale: false
//       }
//
//       if (!acc.has(source)) {
//         acc.set(source, redirect)
//       } else {
//         console.error("Invalid Redirect (duplicate):", source)
//       }
//
//       return acc
//     }, new Map())
//
//     return Array.from(normalized.values())
//   } catch {
//     return []
//   }
// }
//
// function createRewrites(slugs, locale) {
//   const PATH_POSTFIXES = {
//     "take-part": ":slug*",
//     actions: ":slug",
//     news: ":slug",
//     "news/campaigns": ":slug",
//     "news/page": ":slug",
//     press: ":slug",
//     "press/page": ":slug"
//   }
//
//   const rewrites = Object.keys(slugs)
//     .map((key) => {
//       const postfix = PATH_POSTFIXES[key] ? `/${PATH_POSTFIXES[key]}` : ""
//       const source = `/${locale}/${slugs[key]}${postfix}`
//       const destination = `/${locale}/${key}${postfix.replace(/\(.*\)/, "")}`
//
//       const rewrite = []
//
//       if (postfix) {
//         const source = `/${locale}/${slugs[key]}`
//         const destination = `/${locale}/${key}`
//
//         if (source !== destination) {
//           rewrite.push({
//             source,
//             destination,
//             locale: false
//           })
//         }
//       }
//
//       if (source !== destination) {
//         rewrite.push({
//           source,
//           destination,
//           locale: false
//         })
//       }
//
//       return rewrite
//     })
//     .flat()
//
//   // rewrites.forEach(({ source, destination }) =>
//   //   console.log('Rewrite:', source, destination)
//   // );
//
//   return rewrites
// }

/** @type {import('next').NextConfig} */
const nextConfig = {
  // i18n,
  // poweredByHeader: false,
  // reactStrictMode: true,
  //
  // async rewrites() {
  //   const { locales } = i18n
  //   const rewrites = locales.reduce((acc, locale) => {
  //     const slugs = require(`./locales/${locale}/slugs.json`)
  //
  //     return [...acc, ...createRewrites(slugs, locale)]
  //   }, [])
  //
  //   return {
  //     beforeFiles: rewrites
  //   }
  // },
  //
  // async redirects() {
  //   const dynamicRedirects = await fetchAllRedirects()
  //   const staticRedirects = getStaticRedirects()
  //   const cityRedirects = await fetchCityRedirects()
  //
  //   return [...staticRedirects, ...dynamicRedirects, ...cityRedirects]
  // },

  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.(js|ts)x?$/,
      use: ["@svgr/webpack"]
    })

    return config
  }

  // images: {
  //   remotePatterns: [
  //     { protocol: "https", hostname: process.env.NEXT_PUBLIC_IMAGE_HOSTNAME }
  //   ],
  //   minimumCacheTTL: 60 * 60 * 24,
  //   formats: ["image/avif", "image/webp"]
  // },
  //
  // staticPageGenerationTimeout: 60 * 3 * 10,
  //
  // experimental: {
  //   esmExternals: false
  // }
}

//export nextConfig
module.exports = nextConfig

// module.exports = withPlugins(
//   [
//     [
//       withPWA,
//       {
//         pwa: {
//           disable: !isProduction(),
//           dest: "public",
//           runtimeCaching
//         }
//       }
//     ]
//   ],
//   nextConfig
// )

// const normalize = (data) => {
//   const isObject = (data) =>
//     Object.prototype.toString.call(data) === "[object Object]"
//   const isArray = (data) =>
//     Object.prototype.toString.call(data) === "[object Array]"
//
//   const flatten = (data) => {
//     if (!data.attributes) return data
//
//     let idret = {}
//     if (data.id) {
//       idret = { id: data.id }
//     }
//     return {
//       ...idret,
//       ...data.attributes
//     }
//   }
//
//   if (isArray(data)) {
//     return data.map((item) => normalize(item))
//   }
//
//   if (isObject(data)) {
//     if (isArray(data.data)) {
//       data = [...data.data]
//     } else if (isObject(data.data)) {
//       data = flatten({ ...data.data })
//     } else if (data.data === null) {
//       data = null
//     } else {
//       data = flatten(data)
//     }
//
//     for (const key in data) {
//       data[key] = normalize(data[key])
//     }
//
//     return data
//   }
//
//   return data
// }
