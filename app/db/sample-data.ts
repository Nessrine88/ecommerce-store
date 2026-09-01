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
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b",
        "https://images.unsplash.com/photo-1616769303751-7c4d0b0a1b7c",
      ],
      price: "29.99",
      brand: "Green Garden",
      rating: "4.8",
      numReviews: 32,
      stock: 15,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1593482892290-f54927ae2f5a",
    },

    {
      name: "Snake Plant",
      slug: "snake-plant",
      category: "Indoor Plants",
      description:
        "A hardy, low-maintenance indoor plant known for its tall leaves and air-purifying qualities.",
      images: [
        "https://images.unsplash.com/photo-1593482892290-f54927ae2f5a",
        "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee",
      ],
      price: "19.99",
      brand: "Nature Plants",
      rating: "4.7",
      numReviews: 45,
      stock: 20,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1593482892290-f54927ae2f5a",
    },

    {
      name: "Peace Lily",
      slug: "peace-lily",
      category: "Flowering Plants",
      description:
        "An elegant indoor plant with dark green foliage and beautiful white flowers.",
      images: [
        "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee",
        "https://images.unsplash.com/photo-1598880940080-ff9a29891b85",
      ],
      price: "24.99",
      brand: "Bloom House",
      rating: "4.6",
      numReviews: 28,
      stock: 18,
      isFeatured: false,
      banner: "https://images.unsplash.com/photo-1593482892290-f54927ae2f5a",
    },

    {
      name: "Aloe Vera",
      slug: "aloe-vera",
      category: "Succulents",
      description:
        "A popular succulent with thick green leaves. Easy to grow and ideal for sunny indoor spaces.",
      images: [
        "https://images.unsplash.com/photo-1509423350716-97f9360b4e09",
        "https://images.unsplash.com/photo-1596547609652-9cf5d8d106b8",
      ],
      price: "14.99",
      brand: "Desert Green",
      rating: "4.9",
      numReviews: 56,
      stock: 30,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1593482892290-f54927ae2f5a",
    },

    {
      name: "Fiddle Leaf Fig",
      slug: "fiddle-leaf-fig",
      category: "Indoor Trees",
      description:
        "A stylish indoor tree with large glossy leaves that adds a modern tropical feel to your home.",
      images: [
        "https://images.unsplash.com/photo-1509423350716-97f9360b4e09",
        "https://images.unsplash.com/photo-1597055181300-2aebf3b4b7d5",
      ],
      price: "49.99",
      brand: "Urban Jungle",
      rating: "4.5",
      numReviews: 21,
      stock: 12,
      isFeatured: false,
      banner: "https://images.unsplash.com/photo-1593482892290-f54927ae2f5a",
    },

    {
      name: "ZZ Plant",
      slug: "zz-plant",
      category: "Indoor Plants",
      description:
        "A resilient houseplant with glossy green leaves that requires very little maintenance.",
      images: [
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b",
        "https://images.unsplash.com/photo-1632207691143-643e2b6a4d8b",
      ],
      price: "22.99",
      brand: "Green Garden",
      rating: "4.8",
      numReviews: 39,
      stock: 25,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1593482892290-f54927ae2f5a",
    },

    {
      name: "Calathea Orbifolia",
      slug: "calathea-orbifolia",
      category: "Tropical Plants",
      description:
        "A stunning tropical plant featuring large rounded leaves with elegant silver-green stripes.",
      images: [
        "https://images.unsplash.com/photo-1598880940080-ff9a29891b85",
        "https://images.unsplash.com/photo-1604762524889-3e2fcc145683",
      ],
      price: "34.99",
      brand: "Tropical Home",
      rating: "4.7",
      numReviews: 19,
      stock: 10,
      isFeatured: false,
      banner: "https://images.unsplash.com/photo-1593482892290-f54927ae2f5a",
    },

    {
      name: "String of Pearls",
      slug: "string-of-pearls",
      category: "Succulents",
      description:
        "A unique trailing succulent with small pearl-shaped leaves, perfect for hanging planters.",
      images: [
        "https://images.unsplash.com/photo-1600411832986-5a4477b64a1c",
        "https://images.unsplash.com/photo-1616505579900-9e1e7b4e4e0d",
      ],
      price: "18.99",
      brand: "Desert Green",
      rating: "4.6",
      numReviews: 24,
      stock: 16,
      isFeatured: false,
      banner: "https://images.unsplash.com/photo-1593482892290-f54927ae2f5a",
    },

    {
      name: "Rubber Plant",
      slug: "rubber-plant",
      category: "Indoor Trees",
      description:
        "A classic houseplant with large dark green leaves and an attractive upright growth habit.",
      images: [
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b",
        "https://images.unsplash.com/photo-1603436326446-9e5f1e3c1d9c",
      ],
      price: "39.99",
      brand: "Urban Jungle",
      rating: "4.7",
      numReviews: 31,
      stock: 14,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1593482892290-f54927ae2f5a",
    },

    {
      name: "Lavender Plant",
      slug: "lavender-plant",
      category: "Flowering Plants",
      description:
        "A fragrant flowering plant with beautiful purple blooms and a calming natural aroma.",
      images: [
        "https://images.unsplash.com/photo-1499002238440-d264edd596ec",
        "https://images.unsplash.com/photo-1528722828814-77b9b83aafb2",
      ],
      price: "16.99",
      brand: "Bloom House",
      rating: "4.9",
      numReviews: 63,
      stock: 22,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1593482892290-f54927ae2f5a",
    },

    {
      name: "Pothos",
      slug: "pothos",
      category: "Indoor Plants",
      description:
        "A fast-growing trailing plant with heart-shaped leaves. Excellent for beginners.",
      images: [
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b",
        "https://images.unsplash.com/photo-1620127807580-2c0a2e2f6e3e",
      ],
      price: "17.99",
      brand: "Nature Plants",
      rating: "4.8",
      numReviews: 48,
      stock: 28,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1593482892290-f54927ae2f5a",
    },

    {
      name: "Bird of Paradise",
      slug: "bird-of-paradise",
      category: "Tropical Plants",
      description:
        "A dramatic tropical plant with large upright leaves that creates a striking statement indoors.",
      images: [
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b",
        "https://images.unsplash.com/photo-1597055181300-2aebf3b4b7d5",
      ],
      price: "59.99",
      brand: "Tropical Home",
      rating: "4.8",
      numReviews: 17,
      stock: 8,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1593482892290-f54927ae2f5a",
    },
  ],
};

export default sampleData;
