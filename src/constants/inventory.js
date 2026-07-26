export function emptyItem() {
  return {
    mrp: "",
    price: "",
    sell_price: "",
    sku: "",
    skuManuallyEdited: false,
    stocks: "",
    weight: "",
    rating: "",
    rating_count: "",
    yt_iframe: "",
    images: [],
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
  Cameras: [
    "Canon",
    "Nikon",
    "Panasonic",
    "Go Pro",
    "Sony",
    "Fujifilm",
    "Insta360",
  ],
  Consoles: ["Microsoft", "Sony", "Nintendo", "Asus", "Valve"],
};

export const typeMap = {
  Cameras: ["Mirrorless", "DSLR", "Action", "Bridge Super Zoom", "Point & Shoot"],
  Consoles: [
    "Xbox 360",
    "PS4",
    "Xbox One",
    "Switch",
    "PS3",
    "ROG Ally",
    "PS5",
    "Xbox Series",
    "Steam Deck",
    "PS2",
    "PS Vita",
  ],
};
