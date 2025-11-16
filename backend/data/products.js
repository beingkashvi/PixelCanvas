// This is your new, complete list of all products for the store

const products = [
  // ---
  // CATEGORY: APPAREL
  // ---
  {
    name: 'Crew-Neck T-Shirt',
    slug: 'crew-neck-tshirt',
    mainCategory: 'apparel',
    description: 'A classic crew-neck with a modern, slim fit.',
    basePrice: 23.99,
    baseImageUrl: '/images/apparel/crew-neck.png', // Using your local image
    customizationOptions: {
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#222222' },
        { name: 'Heather Grey', hex: '#BDBDBD' },
        { name: 'Royal Blue', hex: '#3498DB' },
      ],
      sizes: [
        { name: 'S', priceModifier: 0 },
        { name: 'M', priceModifier: 0 },
        { name: 'L', priceModifier: 2 },
      ],
      frames: [],
      premadeDesigns: [
        {
          name: 'Minimalist Line Art',
          url: 'https://placehold.co/400x400/333/FFF?text=Line+Art',
        },
      ],
    },
  },
  {
    name: 'Pullover Hoodie',
    slug: 'pullover-hoodie',
    mainCategory: 'apparel',
    description: 'A warm and cozy heavyweight pullover hoodie.',
    basePrice: 34.99,
    baseImageUrl: '/images/apparel/hoodie.png',
    customizationOptions: {
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#222222' },
        { name: 'Charcoal', hex: '#34495E' },
        { name: 'Maroon', hex: '#800000' },
      ],
      sizes: [
        { name: 'S', priceModifier: 0 },
        { name: 'M', priceModifier: 0 },
        { name: 'L', priceModifier: 3 },
        { name: 'XL', priceModifier: 3 },
      ],
      frames: [],
      premadeDesigns: [
        {
          name: 'University Logo',
          url: 'https://placehold.co/400x400/FFC107/333?text=University',
        },
      ],
    },
  },
  {
    name: 'Crewneck Sweatshirt',
    slug: 'crewneck-sweatshirt',
    mainCategory: 'apparel',
    description: 'A sturdy and warm sweatshirt bound to keep you warm.',
    basePrice: 29.99,
    baseImageUrl: '/images/apparel/sweatshirt.png',
    customizationOptions: {
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#222222' },
        { name: 'Sport Grey', hex: '#AAAAAA' },
      ],
      sizes: [
        { name: 'S', priceModifier: 0 },
        { name: 'M', priceModifier: 0 },
        { name: 'L', priceModifier: 2 },
      ],
      frames: [],
      premadeDesigns: [
        {
          name: 'Simple Text',
          url: 'https://placehold.co/400x400/333/FFF?text=Classic',
        },
      ],
    },
  },

  // ---
  // CATEGORY: DRINKWARE
  // ---
  {
    name: 'Ceramic Mug',
    slug: 'ceramic-mug',
    mainCategory: 'drinkware',
    description: 'A classic 11oz ceramic mug. Sturdy and timeless.',
    basePrice: 15.99,
    baseImageUrl: '/images/drinkware/ceramic.png', // Using an external mug image
    customizationOptions: {
      colors: [{ name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#222222' },
      { name: 'Charcoal', hex: '#34495E' },
      { name: 'Maroon', hex: '#800000' },], // No color options for this mug
      sizes: [],
      frames: [],
      premadeDesigns: [
        {
          name: 'Best Dad Ever',
          url: 'https://placehold.co/400x400/3B82F6/FFF?text=Best+Dad',
        },
      ],
    },
  },
  {
    name: 'Bottle',
    slug: 'bottle',
    mainCategory: 'drinkware',
    description:
      'A heat-activated magic mug. Starts black, reveals your design when hot.',
    basePrice: 19.99,
    baseImageUrl: '/images/drinkware/bottle.png', // Can use the same base mug
    customizationOptions: {
      colors: [{ name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#222222' },
      { name: 'Charcoal', hex: '#34495E' },
      { name: 'Maroon', hex: '#800000' },],
      sizes: [],
      frames: [],
      premadeDesigns: [
        {
          name: 'Surprise Message',
          url: 'https://placehold.co/400x400/3B82F6/FFF?text=Surprise!',
        },
      ],
    },
  },

  // ---
  // CATEGORY: ACCESSORIES
  // ---
  {
    name: 'Custom Dad Hat',
    slug: 'custom-dad-hat',
    mainCategory: 'accessories',
    description: 'A classic, comfortable 100% cotton twill dad hat.',
    basePrice: 18.99,
    baseImageUrl: '/images/accessories/hat.png',
    customizationOptions: {
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#222222' },
        { name: 'Khaki', hex: '#C3B091' },
      ],
      sizes: [],
      frames: [],
      premadeDesigns: [
        {
          name: 'Embroidered Logo',
          url: 'https://placehold.co/400x400/FFC107/333?text=Logo',
        },
      ],
    },
  },
  {
    name: 'Standard Tote Bag',
    slug: 'standard-tote-bag',
    mainCategory: 'accessories',
    description: 'A 100% cotton canvas tote bag. Strong and durable.',
    basePrice: 17.99,
    baseImageUrl: '/images/accessories/tote.png',
    customizationOptions: {
      colors: [
        { name: 'Natural', hex: '#F0E6D2' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#222222' },
      ],
      sizes: [],
      frames: [],
      premadeDesigns: [
        {
          name: 'Book Lover',
          url: 'https://placehold.co/400x400/22C55E/FFF?text=Read+More',
        },
      ],
    },
  },
  {
    name: 'Throw Pillow',
    slug: 'throw-pillow',
    mainCategory: 'home-living',
    description: 'A soft, durable 100% spun-polyester pillow.',
    basePrice: 22.99,
    baseImageUrl: '/images/home/pillow.png', // Our new local image
    customizationOptions: {
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Light Grey', hex: '#e0e0e0' },
        { name: 'Cream', hex: '#F5F5DC' },
        { name: 'Black', hex: '#222222' },
      ],
      sizes: [
        { name: '16x16', priceModifier: 0 },
        { name: '18x18', priceModifier: 3 },
        { name: '20x20', priceModifier: 5 },
      ],
      frames: [],
      premadeDesigns: [
        {
          name: 'Home Sweet Home',
          url: 'https://placehold.co/400x400/3B82F6/FFF?text=Home+Sweet+Home',
        },
        {
          name: 'Monogram',
          url: 'https://placehold.co/400x400/EC4899/FFF?text=K',
        },
      ],
    }
  }

  // ---
  // CATEGORY: PRINTS
  // ---
  // {
  //   name: 'Matte Poster',
  //   slug: 'matte-poster',
  //   mainCategory: 'prints',
  //   description: 'A museum-quality poster on thick, durable matte paper.',
  //   basePrice: 19.99,
  //   baseImageUrl: '/images/prints/poster.png',
  //   customizationOptions: {
  //     colors: [], // No color options
  //     sizes: [
  //       { name: '12x18', priceModifier: 0 },
  //       { name: '18x24', priceModifier: 8 },
  //       { name: '24x36', priceModifier: 15 },
  //     ],
  //     frames: [],
  //     premadeDesigns: [
  //       {
  //         name: 'Abstract Art',
  //         url: 'https://placehold.co/400x600/3B82F6/FFF?text=Abstract',
  //       },
  //     ],
  //   },
  // },
  // {
  //   name: 'Framed Poster',
  //   slug: 'framed-poster',
  //   mainCategory: 'prints',
  //   description: 'A ready-to-hang framed poster with a matte black frame.',
  //   basePrice: 39.99,
  //   baseImageUrl: '/images/prints/poster.png',
  //   customizationOptions: {
  //     colors: [], // No color options
  //     sizes: [
  //       { name: '12x18', priceModifier: 0 },
  //       { name: '18x24', priceModifier: 15 },
  //     ],
  //     frames: [
  //       { name: 'Black', hex: '#222222' },
  //       { name: 'White', hex: '#FFFFFF' },
  //       { name: 'Natural Wood', hex: '#D2B48C' },
  //     ],
  //     premadeDesigns: [
  //       {
  //         name: 'Fine Art Print',
  //         url: 'https://placehold.co/400x600/3B82F6/FFF?text=Fine+Art',
  //       },
  //     ],
  //   },
  // },
];

module.exports = { products };
