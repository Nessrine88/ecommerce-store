import ProductCarousel from "@/app/[locale]/components/shared/product/product-carousel";
import ProductList from "@/app/[locale]/components/shared/product/product-list";
import ViewAllProduct from "@/app/[locale]/components/view-all-products";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";
import IconBoxes from "@/app/[locale]/components/icon-boxes";
import { getTranslations } from "next-intl/server";
import {
  Reveal,
  Float,
  Glow,
} from "@/app/[locale]/components/motion-wrappers";

const tipKeys = ["expertiseTip1", "expertiseTip2", "expertiseTip3"] as const;

const Page = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;

  const latestProducts = await getLatestProducts(locale);
  const featuredProducts = await getFeaturedProducts(locale);

  const t = await getTranslations("Homepage");

  return (
    <div className="min-h-screen overflow-hidden bg-[#07130d] text-text">
      <div className="mx-auto max-w-7xl space-y-14 py-8 sm:py-10 md:space-y-20 md:py-14">
        {/* Hero */}
        <section className="relative px-4">
          {/* Animated background glows */}
          <Glow className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-[#3a7a58]/20 blur-3xl" />
          <Glow className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-[#1f4d38]/20 blur-3xl" />

          <div className="relative flex flex-col items-center gap-12 md:flex-row md:gap-14 lg:gap-20">
            {/* Left: Content, staggered entrance */}
            <div className="relative z-10 text-center md:w-[48%] md:text-left">
              <Reveal direction="left" delay={0}>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#3a7a58]/40 bg-[#10251a]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#9fd3b4] shadow-lg shadow-black/20 backdrop-blur-sm">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#70bd91] shadow-[0_0_10px_#70bd91]" />
                  {t("siteTitle")}
                </div>
              </Reveal>

              <Reveal direction="left" delay={0.1}>
                <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {t("siteTitle")}
                  <span className="mt-2 block bg-gradient-to-r from-[#9fd3b4] via-[#70bd91] to-white bg-clip-text text-lg text-transparent">
                    {t("heroSubtitle")}
                  </span>
                </h1>
              </Reveal>

              <Reveal direction="left" delay={0.2}>
                <p className="mt-6 max-w-xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                  {t("expertiseDescription")}
                </p>
              </Reveal>

              {/* Feature pills, one after another */}
              <ul className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
                {tipKeys.map((key, i) => (
                  <Reveal key={key} direction="up" delay={0.3 + i * 0.1}>
                    <li className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-white/85 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#70bd91]/40 hover:bg-[#3a7a58]/20 hover:text-white sm:text-sm">
                      {t(key)}
                    </li>
                  </Reveal>
                ))}
              </ul>

              <Reveal direction="up" delay={0.65}>
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
                  <a
                    href="#latest-products"
                    className="rounded-xl bg-gradient-to-r from-[#3a7a58] to-[#286044] px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-[#1f4d38]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[#3a7a58]/30"
                  >
                    {t("exploreProducts")}
                  </a>

                  <span className="text-xs text-white/40">
                    {t("trustedSelection")}
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Right: carousel slides in, cards behind it float */}
            {featuredProducts.length > 0 && (
              <Reveal
                direction="right"
                delay={0.2}
                duration={0.9}
                className="relative flex min-h-[380px] w-full items-center justify-center md:w-[52%]"
              >
                <Float
                  distance={12}
                  duration={7}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="h-[82%] w-[82%] rotate-[-5deg] rounded-3xl border border-[#3a7a58]/20 bg-[#10251a]/40 shadow-2xl backdrop-blur-sm" />
                </Float>

                <Float
                  distance={8}
                  duration={5}
                  delay={1}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="h-[82%] w-[82%] rotate-[4deg] rounded-3xl border border-white/5 bg-white/[0.02]" />
                </Float>

                <div className="relative z-10 w-full max-w-xl rotate-[1.5deg] transform-gpu transition-transform duration-500 hover:rotate-0">
                  <ProductCarousel data={featuredProducts} />
                </div>
              </Reveal>
            )}
          </div>
        </section>

        {/* Latest products */}
        <section id="latest-products" className="relative scroll-mt-8">
          <Reveal direction="up">
            <div className="mb-7 px-4 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                {t("newestProducts")}
              </h2>
            </div>
          </Reveal>

          <ProductList title="" data={latestProducts} limit={6} />
        </section>

        {/* View all */}
        <section className="flex justify-center px-4">
          <Reveal direction="up">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 shadow-xl backdrop-blur-sm">
              <ViewAllProduct />
            </div>
          </Reveal>
        </section>

        {/* Benefits */}
        <section className="border-t border-white/5 pt-10">
          <Reveal direction="up">
            <IconBoxes />
          </Reveal>
        </section>
      </div>
    </div>
  );
};

export default Page;