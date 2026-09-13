import { hashSync } from "bcrypt-ts-edge";

const sampleData = {
  users: [
    {
      name: "Nessrine",
      email: "infofigue@gmail.com",
      password: hashSync("nessrine2015", 10),
      role: "admin",
    },
    {
      name: "Jane",
      email: "jane@gmail.com",
      password: hashSync("nessrine2015", 10),
      role: "user",
    },
  ],

  products: [
    {
      name: "Monstera Deliciosa",
      slug: "monstera-deliciosa",
      category: "Indoor Plants",
      description:
        "A beautiful tropical houseplant with large, distinctive split leaves. Perfect for bright indoor spaces.",
      images: [
        "https://images.unsplash.com/photo-1654701381111-387c2b090a2e?w=800&q=80",
        "https://images.unsplash.com/photo-1654701381111-387c2b090a2e?w=1200&q=80",
      ],
      price: "29.99",
      brand: "Green Garden",
      rating: "4.8",
      numReviews: 32,
      stock: 15,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1654701381111-387c2b090a2e?w=1600&q=80",

      translations: {
        en: {
          name: "Monstera Deliciosa",
          description:
            "A beautiful tropical houseplant with large, distinctive split leaves. Perfect for bright indoor spaces.",
        },
        fr: {
          name: "Monstera Deliciosa",
          description:
            "Une magnifique plante tropicale d'intérieur aux grandes feuilles découpées caractéristiques. Parfaite pour les espaces intérieurs lumineux.",
        },
        ar: {
          name: "مونستيرا دليسيوسا",
          description:
            "نبتة استوائية منزلية جميلة ذات أوراق كبيرة ومميزة ومشققة. مثالية للمساحات الداخلية المضيئة.",
        },
      },
    },

    {
      name: "Snake Plant",
      slug: "snake-plant",
      category: "Indoor Plants",
      description:
        "A hardy, low-maintenance indoor plant known for its tall leaves and air-purifying qualities.",
      images: [
        "https://images.unsplash.com/photo-1616961108833-b8e10d5dc2be?w=800&q=80",
        "https://images.unsplash.com/photo-1616961108833-b8e10d5dc2be?w=1200&q=80",
      ],
      price: "19.99",
      brand: "Nature Plants",
      rating: "4.7",
      numReviews: 45,
      stock: 20,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1616961108833-b8e10d5dc2be?w=1600&q=80",

      translations: {
        en: {
          name: "Snake Plant",
          description:
            "A hardy, low-maintenance indoor plant known for its tall leaves and air-purifying qualities.",
        },
        fr: {
          name: "Sansevieria",
          description:
            "Une plante d'intérieur résistante et facile à entretenir, connue pour ses longues feuilles et ses propriétés purifiantes.",
        },
        ar: {
          name: "نبتة الثعبان",
          description:
            "نبتة منزلية قوية وسهلة العناية، تتميز بأوراقها الطويلة وقدرتها على تنقية الهواء.",
        },
      },
    },

    {
      name: "Peace Lily",
      slug: "peace-lily",
      category: "Flowering Plants",
      description:
        "An elegant indoor plant with dark green foliage and beautiful white flowers.",
      images: [
        "https://images.unsplash.com/photo-1584543840487-f7c5d8a278c1?w=800&q=80",
        "https://images.unsplash.com/photo-1584543840487-f7c5d8a278c1?w=1200&q=80",
      ],
      price: "24.99",
      brand: "Bloom House",
      rating: "4.6",
      numReviews: 28,
      stock: 18,
      isFeatured: false,
      banner: "https://images.unsplash.com/photo-1584543840487-f7c5d8a278c1?w=1600&q=80",

      translations: {
        en: {
          name: "Peace Lily",
          description:
            "An elegant indoor plant with dark green foliage and beautiful white flowers.",
        },
        fr: {
          name: "Lys de la paix",
          description:
            "Une élégante plante d'intérieur au feuillage vert foncé et aux magnifiques fleurs blanches.",
        },
        ar: {
          name: "زنبق السلام",
          description:
            "نبتة منزلية أنيقة بأوراق خضراء داكنة وزهور بيضاء جميلة.",
        },
      },
    },

    {
      name: "Aloe Vera",
      slug: "aloe-vera",
      category: "Succulents",
      description:
        "A popular succulent with thick green leaves. Easy to grow and ideal for sunny indoor spaces.",
      images: [
        "https://images.unsplash.com/photo-1636687987347-06b9b7f60d68?w=800&q=80",
        "https://images.unsplash.com/photo-1636687987347-06b9b7f60d68?w=1200&q=80",
      ],
      price: "14.99",
      brand: "Desert Green",
      rating: "4.9",
      numReviews: 56,
      stock: 30,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1636687987347-06b9b7f60d68?w=1600&q=80",

      translations: {
        en: {
          name: "Aloe Vera",
          description:
            "A popular succulent with thick green leaves. Easy to grow and ideal for sunny indoor spaces.",
        },
        fr: {
          name: "Aloe Vera",
          description:
            "Une plante succulente populaire aux feuilles vertes épaisses. Facile à cultiver et idéale pour les espaces intérieurs ensoleillés.",
        },
        ar: {
          name: "الألوفيرا",
          description:
            "نبتة عصارية شهيرة ذات أوراق خضراء سميكة. سهلة الزراعة ومثالية للمساحات الداخلية المشمسة.",
        },
      },
    },

    {
      name: "Fiddle Leaf Fig",
      slug: "fiddle-leaf-fig",
      category: "Indoor Trees",
      description:
        "A stylish indoor tree with large glossy leaves that adds a modern tropical feel to your home.",
      images: [
        "https://images.unsplash.com/photo-1617374056496-2fc0d20894e7?w=800&q=80",
        "https://images.unsplash.com/photo-1617374056496-2fc0d20894e7?w=1200&q=80",
      ],
      price: "49.99",
      brand: "Urban Jungle",
      rating: "4.5",
      numReviews: 21,
      stock: 12,
      isFeatured: false,
      banner: "https://images.unsplash.com/photo-1617374056496-2fc0d20894e7?w=1600&q=80",

      translations: {
        en: {
          name: "Fiddle Leaf Fig",
          description:
            "A stylish indoor tree with large glossy leaves that adds a modern tropical feel to your home.",
        },
        fr: {
          name: "Figuier lyre",
          description:
            "Un arbre d'intérieur élégant aux grandes feuilles brillantes qui apporte une touche tropicale moderne à votre maison.",
        },
        ar: {
          name: "التين الورقي",
          description:
            "شجرة منزلية أنيقة ذات أوراق كبيرة لامعة تضفي طابعًا استوائيًا عصريًا على منزلك.",
        },
      },
    },

    {
      // NOTE: could not independently verify a ZZ-plant-specific Unsplash photo
      // within this session — see the message below the code for details.
      name: "ZZ Plant",
      slug: "zz-plant",
      category: "Indoor Plants",
      description:
        "A resilient houseplant with glossy green leaves that requires very little maintenance.",
      images: [
        "https://images.unsplash.com/photo-1632207691143-643e2b6a4d8b?w=800&q=80",
        "https://images.unsplash.com/photo-1632207691143-643e2b6a4d8b?w=1200&q=80",
      ],
      price: "22.99",
      brand: "Green Garden",
      rating: "4.8",
      numReviews: 39,
      stock: 25,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1632207691143-643e2b6a4d8b?w=1600&q=80",

      translations: {
        en: {
          name: "ZZ Plant",
          description:
            "A resilient houseplant with glossy green leaves that requires very little maintenance.",
        },
        fr: {
          name: "Plante ZZ",
          description:
            "Une plante d'intérieur résistante aux feuilles vertes brillantes qui nécessite très peu d'entretien.",
        },
        ar: {
          name: "نبتة الزاميوكولكاس",
          description:
            "نبتة منزلية قوية ذات أوراق خضراء لامعة ولا تحتاج إلى الكثير من العناية.",
        },
      },
    },

    {
      // NOTE: could not independently verify a Calathea-specific Unsplash photo
      // within this session — see the message below the code for details.
      name: "Calathea Orbifolia",
      slug: "calathea-orbifolia",
      category: "Tropical Plants",
      description:
        "A stunning tropical plant featuring large rounded leaves with elegant silver-green stripes.",
      images: [
        "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=800&q=80",
        "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=1200&q=80",
      ],
      price: "34.99",
      brand: "Tropical Home",
      rating: "4.7",
      numReviews: 19,
      stock: 10,
      isFeatured: false,
      banner: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=1600&q=80",

      translations: {
        en: {
          name: "Calathea Orbifolia",
          description:
            "A stunning tropical plant featuring large rounded leaves with elegant silver-green stripes.",
        },
        fr: {
          name: "Calathea Orbifolia",
          description:
            "Une magnifique plante tropicale aux grandes feuilles arrondies ornées d'élégantes rayures vert argenté.",
        },
        ar: {
          name: "كالاتيا أوربيفوليا",
          description:
            "نبتة استوائية رائعة تتميز بأوراق كبيرة مستديرة مزينة بخطوط أنيقة باللونين الأخضر والفضي.",
        },
      },
    },

    {
      // NOTE: could not independently verify a String-of-Pearls-specific Unsplash
      // photo within this session — see the message below the code for details.
      name: "String of Pearls",
      slug: "string-of-pearls",
      category: "Succulents",
      description:
        "A unique trailing succulent with small pearl-shaped leaves, perfect for hanging planters.",
      images: [
        "https://images.unsplash.com/photo-1600411832986-5a4477b64a1c?w=800&q=80",
        "https://images.unsplash.com/photo-1600411832986-5a4477b64a1c?w=1200&q=80",
      ],
      price: "18.99",
      brand: "Desert Green",
      rating: "4.6",
      numReviews: 24,
      stock: 16,
      isFeatured: false,
      banner: "https://images.unsplash.com/photo-1600411832986-5a4477b64a1c?w=1600&q=80",

      translations: {
        en: {
          name: "String of Pearls",
          description:
            "A unique trailing succulent with small pearl-shaped leaves, perfect for hanging planters.",
        },
        fr: {
          name: "Collier de perles",
          description:
            "Une plante succulente retombante unique aux petites feuilles en forme de perles, parfaite pour les jardinières suspendues.",
        },
        ar: {
          name: "سلسلة اللؤلؤ",
          description:
            "نبتة عصارية متدلية مميزة بأوراق صغيرة تشبه اللآلئ، مثالية للأحواض المعلقة.",
        },
      },
    },

    {
      // NOTE: could not independently verify a rubber-plant-specific Unsplash
      // photo within this session — see the message below the code for details.
      name: "Rubber Plant",
      slug: "rubber-plant",
      category: "Indoor Trees",
      description:
        "A classic houseplant with large dark green leaves and an attractive upright growth habit.",
      images: [
        "https://images.unsplash.com/photo-1603436326446-9e5f1e3c1d9c?w=800&q=80",
        "https://images.unsplash.com/photo-1603436326446-9e5f1e3c1d9c?w=1200&q=80",
      ],
      price: "39.99",
      brand: "Urban Jungle",
      rating: "4.7",
      numReviews: 31,
      stock: 14,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1603436326446-9e5f1e3c1d9c?w=1600&q=80",

      translations: {
        en: {
          name: "Rubber Plant",
          description:
            "A classic houseplant with large dark green leaves and an attractive upright growth habit.",
        },
        fr: {
          name: "Caoutchouc",
          description:
            "Une plante d'intérieur classique aux grandes feuilles vert foncé et au port dressé élégant.",
        },
        ar: {
          name: "نبتة المطاط",
          description:
            "نبتة منزلية كلاسيكية ذات أوراق كبيرة خضراء داكنة ونمو قائم جذاب.",
        },
      },
    },

    {
      name: "Lavender Plant",
      slug: "lavender-plant",
      category: "Flowering Plants",
      description:
        "A fragrant flowering plant with beautiful purple blooms and a calming natural aroma.",
      images: [
        "https://images.unsplash.com/photo-1639107725072-8dca6a760c08?w=800&q=80",
        "https://images.unsplash.com/photo-1639107725072-8dca6a760c08?w=1200&q=80",
      ],
      price: "16.99",
      brand: "Bloom House",
      rating: "4.9",
      numReviews: 63,
      stock: 22,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1639107725072-8dca6a760c08?w=1600&q=80",

      translations: {
        en: {
          name: "Lavender Plant",
          description:
            "A fragrant flowering plant with beautiful purple blooms and a calming natural aroma.",
        },
        fr: {
          name: "Lavande",
          description:
            "Une plante fleurie parfumée aux magnifiques fleurs violettes et à l'arôme naturel apaisant.",
        },
        ar: {
          name: "نبتة اللافندر",
          description:
            "نبتة عطرية مزهرة ذات أزهار بنفسجية جميلة ورائحة طبيعية مهدئة.",
        },
      },
    },

    {
      // NOTE: could not independently verify a pothos-specific Unsplash photo
      // within this session — see the message below the code for details.
      name: "Pothos",
      slug: "pothos",
      category: "Indoor Plants",
      description:
        "A fast-growing trailing plant with heart-shaped leaves. Excellent for beginners.",
      images: [
        "https://images.unsplash.com/photo-1620127807580-2c0a2e2f6e3e?w=800&q=80",
        "https://images.unsplash.com/photo-1620127807580-2c0a2e2f6e3e?w=1200&q=80",
      ],
      price: "17.99",
      brand: "Nature Plants",
      rating: "4.8",
      numReviews: 48,
      stock: 28,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1620127807580-2c0a2e2f6e3e?w=1600&q=80",

      translations: {
        en: {
          name: "Pothos",
          description:
            "A fast-growing trailing plant with heart-shaped leaves. Excellent for beginners.",
        },
        fr: {
          name: "Pothos",
          description:
            "Une plante retombante à croissance rapide aux feuilles en forme de cœur. Excellente pour les débutants.",
        },
        ar: {
          name: "البوتس",
          description:
            "نبتة متدلية سريعة النمو ذات أوراق على شكل قلب. مناسبة جدًا للمبتدئين.",
        },
      },
    },

    {
      // NOTE: could not independently verify a bird-of-paradise-specific
      // Unsplash photo within this session — see the message below the code.
      name: "Bird of Paradise",
      slug: "bird-of-paradise",
      category: "Tropical Plants",
      description:
        "A dramatic tropical plant with large upright leaves that creates a striking statement indoors.",
      images: [
        "https://images.unsplash.com/photo-1597055181300-2aebf3b4b7d5?w=800&q=80",
        "https://images.unsplash.com/photo-1597055181300-2aebf3b4b7d5?w=1200&q=80",
      ],
      price: "59.99",
      brand: "Tropical Home",
      rating: "4.8",
      numReviews: 17,
      stock: 8,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1597055181300-2aebf3b4b7d5?w=1600&q=80",

      translations: {
        en: {
          name: "Bird of Paradise",
          description:
            "A dramatic tropical plant with large upright leaves that creates a striking statement indoors.",
        },
        fr: {
          name: "Oiseau de paradis",
          description:
            "Une plante tropicale spectaculaire aux grandes feuilles dressées qui crée un effet saisissant à l'intérieur.",
        },
        ar: {
          name: "عصفور الجنة",
          description:
            "نبتة استوائية مميزة ذات أوراق كبيرة قائمة تضفي مظهرًا لافتًا داخل المنزل.",
        },
      },
    },
  ],
};

export default sampleData;