export function emptyItem() {
  return {
    mrp: "",
    price: "",
    sell_price: "",
    sku: "",
    stocks: "",
    weight: "",
    rating: "",
    rating_count: "",
    yt_iframe: "",
    imagesText: "",
    combination_name: "",
    attributes: {},
    sell: false,
  };
}

export const categories = [
  { name: "PS5 CDs", code: "D001Y" },
  { name: "PS4 CDs", code: "D002Y" },
  { name: "Pre Orders", code: "D003Y" },
  { name: "Consoles", code: "D004Y" },
  { name: "Controllers", code: "D005Y" },
  { name: "Accessories", code: "D006Y" },
  { name: "PC Components", code: "D009Y" },
  { name: "Cameras", code: "D014Y" },
  { name: "Camera Lens", code: "D015Y" },
  { name: "Laptops", code: "D018Y" },
  { name: "Smartphones", code: "D019Y" },
  { name: "Smart Devices", code: "D020Y" },
  { name: "Audio Devices", code: "D021Y" },
];

export const brandMap = {
  Cameras: ["All Brand", "Canon", "Nikon", "Panasonic", "Go Pro", "Sony"],
  Consoles: ["Sony", "Microsoft", "Nintendo", "All Brand"],
  Laptop: ["Dell", "HP", "Apple", "Asus", "All Brand"],
  Laptops: ["Dell", "HP", "Apple", "Asus", "All Brand"],
  "Smart Phones": ["Samsung", "Apple", "OnePlus", "All Brand"],
  "Pre Orders": ["Capcom", "Rockstar Games"],
};

export const typeMap = {
  Cameras: ["Mirrorless", "DSLR", "Action", "Point & Shoot"],
  Consoles: ["PlayStation", "Xbox", "Nintendo", "PS4"],
  Laptop: ["Ultrabook", "Gaming", "Notebook"],
  Laptops: ["Ultrabook", "Gaming", "Notebook"],
  "Smart Phones": ["Android Phone", "iPhone", "Feature Phone"],
  Controllers: ["Wireless", "Wired"],
  "Pre Orders": [],
};
