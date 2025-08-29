// import { env } from "@/env.mjs";
// import { type MetadataRoute } from 'next';
// import { i18n } from "../i18n-config";
// import { sanityFetch } from "@/sanity/lib/fetch";
// import { AppListQueryForSitemapResult, AppTypeListQueryForSitemapResult, CategoryListQueryForSitemapResult, ProductListQueryForSitemapResult } from "@/sanity.types";
// import { appListQueryForSitemap, appTypeListQueryForSitemap, categoryListQueryForSitemap, productListQueryForSitemap } from "@/sanity/lib/queries";

// const site_url = env.NEXT_PUBLIC_APP_URL;

// // https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
// // https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generate-a-localized-sitemap
// // https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//     console.log('sitemap start');

//     const sitemapList: MetadataRoute.Sitemap = []; // final result

//     const sitemapRoutes: MetadataRoute.Sitemap = [
//         {
//             url: '', // home
//             lastModified: new Date(),
//             changeFrequency: 'daily',
//             priority: 1,
//         },
//         {
//             url: 'dashboard/submit',
//             lastModified: new Date(),
//             changeFrequency: 'weekly',
//             priority: 1,
//         },
//         {
//             url: 'dashboard/app',
//             lastModified: new Date(),
//             changeFrequency: 'weekly',
//             priority: 1,
//         },
//         {
//             url: 'about',
//             lastModified: new Date(),
//             changeFrequency: 'weekly',
//             priority: 0.8,
//         },
//         {
//             url: 'privacy',
//             lastModified: new Date(),
//             changeFrequency: 'monthly',
//             priority: 0.8,
//         },
//         {
//             url: 'terms',
//             lastModified: new Date(),
//             changeFrequency: 'monthly',
//             priority: 0.8,
//         },
//     ];

//     sitemapRoutes.forEach((route) => {
//         i18n.locales.forEach((locale) => {
//             const lang = `/${locale}`;
//             const routeUrl = route.url === '' ? '' : `/${route.url}`;
//             console.log(`sitemap, url:${site_url}${lang}${routeUrl}`);
//             sitemapList.push({
//                 ...route,
//                 url: `${site_url}${lang}${routeUrl}`,
//             });
//         })
//     })

//     const [appListQueryResult, appTypeListQueryResult,
//         categoryListQueryResult, productListQueryResult] = await Promise.all([
//             sanityFetch<AppListQueryForSitemapResult>({
//                 query: appListQueryForSitemap,
//             }),
//             sanityFetch<AppTypeListQueryForSitemapResult>({
//                 query: appTypeListQueryForSitemap,
//             }),
//             sanityFetch<CategoryListQueryForSitemapResult>({
//                 query: categoryListQueryForSitemap,
//             }),
//             sanityFetch<ProductListQueryForSitemapResult>({
//                 query: productListQueryForSitemap,
//             }),
//         ]);

//     console.log('sitemap, appListQueryResult size:', appListQueryResult.length);
//     console.log('sitemap, appTypeListQueryResult size:', appTypeListQueryResult.length);
//     console.log('sitemap, categoryListQueryResult size:', categoryListQueryResult.length);
//     console.log('sitemap, productListQueryResult size:', productListQueryResult.length);

//     appListQueryResult.forEach((app) => {
//         i18n.locales.forEach((locale) => {
//             const lang = `/${locale}`;
//             if (app.name) {
//                 const routeUrl = `/app/${encodeURIComponent(app.name)}`;
//                 console.log(`sitemap, url:${site_url}${lang}${routeUrl}`);
//                 sitemapList.push({
//                     url: `${site_url}${lang}${routeUrl}`,
//                     lastModified: new Date(),
//                     changeFrequency: 'daily',
//                     priority: 1,
//                 });
//             } else {
//                 console.warn(`sitemap, name invalid, id:${app._id}`);
//             }
//         })
//     })

//     appTypeListQueryResult.forEach((apptype) => {
//         i18n.locales.forEach((locale) => {
//             const lang = `/${locale}`;
//             const routeUrl = `/apptype/${apptype.slug}`;
//             console.log(`sitemap, url:${site_url}${lang}${routeUrl}`);
//             sitemapList.push({
//                 url: `${site_url}${lang}${routeUrl}`,
//                 lastModified: new Date(),
//                 changeFrequency: 'daily',
//                 priority: 1,
//             });
//         })
//     })

//     categoryListQueryResult.forEach((category) => {
//         i18n.locales.forEach((locale) => {
//             const lang = `/${locale}`;
//             const routeUrl = `/group/${category.group?.slug}/category/${category.slug}`;
//             console.log(`sitemap, url:${site_url}${lang}${routeUrl}`);
//             sitemapList.push({
//                 url: `${site_url}${lang}${routeUrl}`,
//                 lastModified: new Date(),
//                 changeFrequency: 'daily',
//                 priority: 1,
//             });
//         })
//     })

//     productListQueryResult.forEach((product) => {
//         i18n.locales.forEach((locale) => {
//             const lang = `/${locale}`;
//             const routeUrl = `/product/${product.slug}`;
//             console.log(`sitemap, url:${site_url}${lang}${routeUrl}`);
//             sitemapList.push({
//                 url: `${site_url}${lang}${routeUrl}`,
//                 lastModified: new Date(),
//                 changeFrequency: 'daily',
//                 priority: 1,
//             });
//         })
//     })

//     console.log('sitemap end, size:', sitemapList.length);
//     return sitemapList;
// }

import { type MetadataRoute } from "next";
import { i18n } from "../i18n-config";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // 构建阶段只返回最小 sitemap
    if (process.env.NEXT_PUBLIC_APP_URL && process.env.VERCEL_ENV === "production") {
      const minimalSitemap = i18n.locales.map((locale) => ({
        url: `${site_url}/${locale}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      }));

      return minimalSitemap;
    }

    // 运行时动态 import Sanity
    const { sanityFetch } = await import("@/sanity/lib/fetch");
    const {
      appListQueryForSitemap,
      appTypeListQueryForSitemap,
      categoryListQueryForSitemap,
      productListQueryForSitemap,
    } = await import("@/sanity/lib/queries");

    const [apps, appTypes, categories, products] = await Promise.all([
      sanityFetch({ query: appListQueryForSitemap }),
      sanityFetch({ query: appTypeListQueryForSitemap }),
      sanityFetch({ query: categoryListQueryForSitemap }),
      sanityFetch({ query: productListQueryForSitemap }),
    ]);

    const sitemapList: MetadataRoute.Sitemap = [];

    // 基础静态页面
    const baseRoutes = ["", "dashboard/submit", "dashboard/app", "about", "privacy", "terms"];
    baseRoutes.forEach((route) => {
      i18n.locales.forEach((locale) => {
        const lang = `/${locale}`;
        const routeUrl = route === "" ? "" : `/${route}`;
        sitemapList.push({
          url: `${site_url}${lang}${routeUrl}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 1,
        });
      });
    });

    // App 列表
    apps.forEach((app: any) => {
      if (!app.slug) return;
      i18n.locales.forEach((locale) => {
        sitemapList.push({
          url: `${site_url}/${locale}/app/${app.slug}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 1,
        });
      });
    });

    // AppType 列表
    appTypes.forEach((type: any) => {
      if (!type.slug) return;
      i18n.locales.forEach((locale) => {
        sitemapList.push({
          url: `${site_url}/${locale}/apptype/${type.slug}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 1,
        });
      });
    });

    // Category 列表
    categories.forEach((category: any) => {
      if (!category.slug || !category.group?.slug) return;
      i18n.locales.forEach((locale) => {
        sitemapList.push({
          url: `${site_url}/${locale}/group/${category.group.slug}/category/${category.slug}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 1,
        });
      });
    });

    // Product 列表
    products.forEach((product: any) => {
      if (!product.slug) return;
      i18n.locales.forEach((locale) => {
        sitemapList.push({
          url: `${site_url}/${locale}/product/${product.slug}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 1,
        });
      });
    });

    return sitemapList;
  } catch (e) {
    console.warn("sitemap error, fallback to minimal:", e);
    // 返回最小 sitemap 避免构建失败
    return i18n.locales.map((locale) => ({
      url: `${site_url}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    }));
  }
}



