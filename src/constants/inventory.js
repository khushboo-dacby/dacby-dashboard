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
  { name: "Audio Devices", code: "D021Y" }
];

export const brandMap = {
  Cameras: ["All Brand", "Canon", "Nikon", "Panasonic", "Go Pro", "Sony"],
  Consoles: ["Sony", "Microsoft", "Nintendo", "All Brand"],
  Laptop: ["Dell", "HP", "Apple", "Asus", "All Brand"],
  Laptops: ["Dell", "HP", "Apple", "Asus", "All Brand"],
  "Smart Phones": ["Samsung", "Apple", "OnePlus", "All Brand"],
  "Pre Orders": ["Capcom","Rockstar Games"]
};

export const typeMap = {
  Cameras: ["Mirrorless", "DSLR", "Action", "Point & Shoot"],
  Consoles: ["PlayStation", "Xbox", "Nintendo", "PS4"],
  Laptop: ["Ultrabook", "Gaming", "Notebook"],
  Laptops: ["Ultrabook", "Gaming", "Notebook"],
  "Smart Phones": ["Android Phone", "iPhone", "Feature Phone"],
  Controllers: ["Wireless", "Wired"],
  "Pre Orders": []
};
export const SEARCH_RESULTS = [
    {
        "docId": "rLk0HCQMCNmuhcjzx80k",
        "score": 6.759801201796072,
        "outOfStock": true,
        "product": {
            "product_title": "Microsoft Xbox One",
            "price": 12999,
            "mrp": 19999,
            "image": "https://dacby-database.web.app/cdn/Banners%2FMicrosoft-Xbox-One-500-GB-Pre-owned.webp?alt=media&token=8269ea2e-9de2-4230-bc51-54dfd46bfba7",
            "sell": true,
            "category": "Consoles",
            "sell_max_price": 7500,
            "outOfStock": true,
            "variants": 3,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    },
     {
        "docId": "TXTnJ4HuCt2bG4oNe8cZ",
        "score": 7.462318134231943,
        "outOfStock": false,
        "product": {
            "product_title": "Nikon D3100 Dslr Camera With 18-55mm Kit Lens",
            "price": 14999,
            "mrp": 27999,
            "image": "https://dacby-database.web.app/cdn/11%2Fps4%20cd%2F1%20CAMERAS%2FNIKON%203100D%2Fa4d9a53f-bd16-4ad2-9994-84688bc52f3a_2040x2040.png?alt=media&token=7d93e731-3ccf-4be5-afa8-378286945c98",
            "sell": true,
            "category": "Cameras",
            "sell_max_price": 7800,
            "outOfStock": false,
            "variants": 3,
            "condition": "Pre Owned",
            "code": "D014Y"
        }
    },
     {
        "docId": "aJRqoPbV7y5s3AWDGGyc",
        "score": 6.985802466693666,
        "outOfStock": true,
        "product": {
            "product_title": "Apple Iphone 14",
            "price": 33899,
            "mrp": 89900,
            "image": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight11_2040x2040.jpg?alt=media&token=96844a23-c0c5-4450-a553-2309ac62d58e",
            "sell": false,
            "category": "Smartphones",
            "sell_max_price": 10000,
            "outOfStock": true,
            "variants": 72,
            "condition": "Pre Owned",
            "code": "D019Y"
        }
    },
    {
        "docId": "DoSbFOsOB7nSvAHWjbqs",
        "score": 6.748777133558521,
        "outOfStock": true,
        "product": {
            "product_title": "Apple Macbook Pro 2021 A2442 (m1 Pro, 14-inch)",
            "price": 74994,
            "mrp": 194900,
            "image": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
            "sell": false,
            "category": "Laptops",
            "sell_max_price": 15000,
            "outOfStock": true,
            "variants": 64,
            "condition": "Pre Owned",
            "code": "D018Y"
        }
    },
    {
        "docId": "CHnnnUqHYEsfp0wJ3yen",
        "score": 6.733686861624823,
        "outOfStock": true,
        "product": {
            "product_title": "Nintendo Switch Lite",
            "price": 10799,
            "mrp": 29999,
            "image": "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/1%20NEW%20WEBSITE%20LISTING%2FConsoles%2F1%202%20(1).jpg?alt=media&token=5592f41d-43ac-4097-b7df-8c44647eba9b",
            "sell": true,
            "category": "Consoles",
            "sell_max_price": 8000,
            "outOfStock": true,
            "variants": 5,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    },
    {
        "docId": "Hd3Ybit6dm5COXoiDyJq",
        "score": 6.722359342796053,
        "outOfStock": true,
        "product": {
            "product_title": "Nintendo Switch V2",
            "price": 15999,
            "mrp": 27999,
            "image": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FNINTENDO%2FNENTENDO%20V1%20BLUE%2F9a4469b3-334a-4664-8b22-a96cf624e352_2040x2040.png?alt=media&token=267b464e-e655-4fc8-88f8-45c61db44eb9",
            "sell": false,
            "category": "Consoles",
            "sell_max_price": 11500,
            "outOfStock": true,
            "variants": 2,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    },
    {
        "docId": "kdls51ZkN9jo6Xnktf7z",
        "score": 6.681255413299871,
        "outOfStock": true,
        "product": {
            "product_title": "Valve Steam Deck (oled)",
            "price": 46999,
            "mrp": 89999,
            "image": "https://dacby-database.web.app/cdn/steam-deck-lcd%2Ffcdfe9dc41a64aa39e1d9695d306414c.webp?alt=media&token=b9dc062a-42f3-478b-85d9-8b82f057a517",
            "sell": true,
            "category": "Consoles",
            "sell_max_price": 37000,
            "outOfStock": true,
            "variants": 2,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    },
    {
        "docId": "ihhsH7JxkS4l0fntQhcA",
        "score": 6.672124707914463,
        "outOfStock": true,
        "product": {
            "product_title": "Valve Steam Deck (lcd)",
            "price": 28999,
            "mrp": 53999,
            "image": "https://dacby-database.web.app/cdn/steam-deck-lcd%2Ffcdfe9dc41a64aa39e1d9695d306414c.webp?alt=media&token=b9dc062a-42f3-478b-85d9-8b82f057a517",
            "sell": true,
            "category": "Consoles",
            "sell_max_price": 27500,
            "outOfStock": true,
            "variants": 3,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    },
    {
        "docId": "df3FTQdSTWvgj8EvoOWZ",
        "score": 6.61764730422009,
        "outOfStock": true,
        "product": {
            "product_title": "Sony Playstation Ps4 Pro (early Model)",
            "price": 30000,
            "mrp": 37999,
            "image": "https://dacby-database.web.app/cdn/1111111111111111111111111111111%2Fps4%20pro%20white%2Ff4f67807-b340-4d61-9711-50a744967a39_2040x2040.png?alt=media&token=51c92a13-9636-403d-aaf2-508cfea51fe0",
            "sell": false,
            "category": "Consoles",
            "sell_max_price": 18500,
            "outOfStock": true,
            "variants": 2,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    },
    {
        "docId": "vYSR820JpagXxRGj5AdC",
        "score": 6.616351986548965,
        "outOfStock": true,
        "product": {
            "product_title": "Nintendo Switch Lite Pokemon (special Edition)",
            "price": 11999,
            "mrp": 25999,
            "image": "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/1%20NEW%20WEBSITE%20LISTING%2FConsoles%2FNintendo%20Switch%20lite%20Pokemon%20Edition%2Fpxx_2040x2040.png?alt=media&token=5650565e-d1a6-406e-83cf-fb2b6e0eda05",
            "sell": false,
            "category": "Consoles",
            "sell_max_price": 9000,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    },
    {
        "docId": "uHsoedVrIW6VE01vXSKQ",
        "score": 6.598472745294261,
        "outOfStock": true,
        "product": {
            "product_title": "Sony Ps4 Playstation Standard Destiny (limited Edition)",
            "price": 18999,
            "mrp": 29999,
            "image": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FConsoles%2FPS4%20Standard%20Destiny%20Edition%2FDestiny11%20_2040x2040.png?alt=media&token=5cc145b9-82de-4aba-93b1-33e856dc4144",
            "sell": true,
            "category": "Consoles",
            "sell_max_price": 12500,
            "outOfStock": true,
            "variants": 2,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    },
    {
        "docId": "KheIryIT0drGn1nooWcw",
        "score": 6.595401579144059,
        "outOfStock": true,
        "product": {
            "product_title": "Nintendo Switch - Oled Model",
            "price": 18999,
            "mrp": 34999,
            "image": "https://dacby-database.web.app/cdn/11%2Fps4%20cd%2F2%2Fps5%2FNINTENDO%2FWHITE%2F7a2c6cd3-ecb2-49f9-b651-0ac84d57f401_2040x2040.png?alt=media&token=b0aec137-6e93-4c88-9fd2-d7c7f6537374",
            "sell": true,
            "category": "Consoles",
            "sell_max_price": 14500,
            "outOfStock": true,
            "variants": 2,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    },
    {
        "docId": "xY0cQX9jlJ4vRF9dwbDr",
        "score": 6.594529950335176,
        "outOfStock": true,
        "product": {
            "product_title": "Sony Playstation Ps4 1 Tb Call Of Duty Black Ops Iii Limited Edition",
            "price": 19999,
            "mrp": 27999,
            "image": "https://dacby-database.web.app/cdn/Console%2FPS4_Standard_1_TB_Call_Of_Duty_Black_Ops_III_Limited_Edition_(2)%5B1%5D.webp?alt=media&token=e407fc60-ad43-4ca3-8ea7-e3ec48c190f1",
            "sell": true,
            "category": "Consoles",
            "sell_max_price": 12500,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    },
    {
        "docId": "rCRCnEv6AV7CLFlNB2zb",
        "score": 6.585289247820331,
        "outOfStock": true,
        "product": {
            "product_title": "Sony Playstation 4 Slim 1 Tb Call Of Duty Wwii Limited Edition",
            "price": 22999,
            "mrp": 29999,
            "image": "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/1%20NEW%20WEBSITE%20LISTING%2FConsoles%2FSony%20PlayStation%204%20Slim%201%20TB%20Call%20of%20Duty%20WWII%20Limited%20Edition%2FCCD22_2040x2040.png?alt=media&token=0f61bd76-58d4-46e3-9648-81ed047c9e25",
            "sell": true,
            "category": "Consoles",
            "sell_max_price": 13500,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    },
    {
        "docId": "uBY3gjsxlXbwj52fgBBA",
        "score": 6.5847314160296735,
        "outOfStock": true,
        "product": {
            "product_title": "Nintendo Switch Lite Animal Crossing Timmy And Tommy Aloha Limited Edition",
            "price": 11999,
            "mrp": 25999,
            "image": "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/1%20NEW%20WEBSITE%20LISTING%2FConsoles%2FNintendo%20switch%20lite%20animal%20crossing%20timmy%20and%20tommy%20aloha%20edition%2FTT11_2040x2040.png?alt=media&token=71980461-738e-4329-8cd9-98df7177287d",
            "sell": true,
            "category": "Consoles",
            "sell_max_price": 9000,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    },
    {
        "docId": "quZMezNwjagOv1I0b8Yp",
        "score": 6.583349771964252,
        "outOfStock": true,
        "product": {
            "product_title": "Microsoft Xbox Series X",
            "price": 51999,
            "mrp": 77777,
            "image": "https://dacby-database.web.app/cdn/series-x%2Fd1e66ae39b7a4a58a579aecf08ef352f.webp?alt=media&token=13f9d153-f30d-4474-b0ff-d6d8b100312a",
            "sell": true,
            "category": "Consoles",
            "sell_max_price": 38500,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    },
    {
        "docId": "U8qllAlyUggm6VgXuwWJ",
        "score": 6.581293605230083,
        "outOfStock": true,
        "product": {
            "product_title": "Asus Rog Ally X Amd Ryzen Z1 Extreme",
            "price": 65999,
            "mrp": 107999,
            "image": "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/1%20NEW%20WEBSITE%20LISTING%2FConsoles%2FAsus%20Rog%20Ally%20X%201TB%2FROG11_2040x2040.png?alt=media&token=199cebc2-489f-44ad-9365-02b7d64fd91e",
            "sell": true,
            "category": "Consoles",
            "sell_max_price": 40000,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    },
    {
        "docId": "zmD86nefUa6AuFJbjqCp",
        "score": 6.580833785580808,
        "outOfStock": true,
        "product": {
            "product_title": "Sony Ps Vita Wi-fi+3g",
            "price": 11999,
            "mrp": 19990,
            "image": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FConsoles%2FSony%20PS%20Vita%20Wi-Fi%2B3G%2FVita11_2040x2040.png?alt=media&token=91df506c-7abe-4203-bff9-0861ea92acbf",
            "sell": true,
            "category": "Consoles",
            "sell_max_price": 6000,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    },
    {
        "docId": "FHwh3zjGG0PXQTowzlRn",
        "score": 6.577286027982727,
        "outOfStock": true,
        "product": {
            "product_title": "Microsoft Xbox One S",
            "price": 14499,
            "mrp": 19999,
            "image": "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/1%20NEW%20WEBSITE%20LISTING%2FConsoles%2FMicrosoft%20Xbox%20One%20S%20500GB%20Deep%20Blue%2FXD22_2040x2040.png?alt=media&token=b5be6a4c-9460-46d8-8695-8b3915044580",
            "sell": true,
            "category": "Consoles",
            "sell_max_price": 11500,
            "outOfStock": true,
            "variants": 4,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    },
    {
        "docId": "OvGtPwdxH6QOV8zOaePN",
        "score": 6.576314193121463,
        "outOfStock": true,
        "product": {
            "product_title": "Nintendo Switch Mario Red - Oled Model (limited Edition)",
            "price": 18999,
            "mrp": 46990,
            "image": "https://dacby-database.web.app/cdn/11%2Fps4%20cd%2F2%2Fps5%2FNINTENDO%2FRED%20BLACK%2F08cfb3b6-cbbf-4c12-8612-e534fb57c80a_2040x2040.png?alt=media&token=6b1f5e77-198d-41f6-b95d-335cef6991d7",
            "sell": true,
            "category": "Consoles",
            "sell_max_price": 14500,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    },
    {
        "docId": "m6ZqBzYQweAQaTiZqqTi",
        "score": 6.576193289520274,
        "outOfStock": true,
        "product": {
            "product_title": "Sony Playstation Ps2 Slim",
            "price": 9999,
            "mrp": 10000,
            "image": "https://dacby-database.web.app/cdn/Console%2F3d72e0af-895c-4220-8437-852011178025.png?alt=media&token=a49653ac-3837-4640-92c1-c18b376ae463",
            "sell": true,
            "category": "Consoles",
            "sell_max_price": 2000,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    },
    {
        "docId": "6zbrNZTfmEgnBsfcHEjD",
        "score": 6.571290533467783,
        "outOfStock": true,
        "product": {
            "product_title": "Ps3 Controller",
            "price": 1399,
            "mrp": 2999,
            "image": "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/1%20NEW%20WEBSITE%20LISTING%2FControllers%2FPS3%20Dualshock%203%20White%20Controller%2Fyz111_2040x2040.png?alt=media&token=a2acf359-e18a-4090-aa86-dec358f83f11",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 10,
            "outOfStock": true,
            "variants": 4,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "xs8cYwBpnBSdefAy6MZi",
        "score": 6.57058385899714,
        "outOfStock": false,
        "product": {
            "product_title": "Nintendo Switch V1",
            "price": 21999,
            "mrp": 45990,
            "image": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FNINTENDO%2FNINTENDO%20V1%20RED%20BLUE%2F7f4328d4-3fc2-4747-910d-1ec50de54286_2040x2040.png?alt=media&token=fe39ce61-894e-4800-a18e-7d580bbbaf8b",
            "sell": true,
            "category": "Consoles",
            "sell_max_price": 14000,
            "outOfStock": false,
            "variants": 2,
            "condition": "Pre Owned",
            "code": "D004Y"
        }
    }
];
export const SPECIAL_EDITIONS = [
    {
        "docId": "OgKFjmQtJf30igiPdgQR",
        "score": 7.0651126948789775,
        "outOfStock": true,
        "product": {
            "product_title": "Ps4 Dualshock V1 (uncharted 4 Special Edition)",
            "price": 2799,
            "mrp": 3999,
            "image": "https://dacby-database.web.app/cdn/Controllers%20new%2FPS4%20Dualshock%20V1%20(Uncharted%204%20Special%20Edition)%201_2040x2040.png?alt=media&token=b70284a8-5a05-45c6-b578-9fc3b013a257",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 1750,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "inoZgkHZMWi16FN5vArD",
        "score": 7.051816992652733,
        "outOfStock": true,
        "product": {
            "product_title": "Ps4 Dualshock V2 (gt Sport)",
            "price": 2999,
            "mrp": 4999,
            "image": "https://dacby-database.web.app/cdn/Controllers%20new%2FPS4%20Dualshock%20V2%20(GT%20Sport%20Silver)%201_2040x2040.png?alt=media&token=b5ffa5ea-38f8-497d-8776-1ca8a9c15771",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 1950,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "UclZcxS0awQBsG1LlWe8",
        "score": 6.96277396097897,
        "outOfStock": true,
        "product": {
            "product_title": "Ps4 Dualshock V2 (days Of Play Limited Edition)",
            "price": 2999,
            "mrp": 4499,
            "image": "https://dacby-database.web.app/cdn/Controllers%2Fsilverv1%2F8eb3139a-2f63-4907-b88f-66335991ce0f_2040x2040.png?alt=media&token=b09362b5-d300-4eae-8e23-57aa2c3dbf60",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 1950,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "PTQepu5hnrcDo5wlUWKi",
        "score": 6.950404021420069,
        "outOfStock": true,
        "product": {
            "product_title": "Ps4 Dualshock V1 (batman Arkham Knight Special Edition)",
            "price": 2799,
            "mrp": 3999,
            "image": "https://dacby-database.web.app/cdn/Controllers%2Fbatman%2F436aa2d7-1052-4c78-891f-aba200e5df76_2040x2040.png?alt=media&token=cde26ef1-1d6c-4047-b0df-4288868e51c2",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 1750,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "xFMxRQvnQW2fKvGGk6A8",
        "score": 6.913360847725265,
        "outOfStock": true,
        "product": {
            "product_title": "Ps4 Dualshock V1 (vader Star Wars Controller) Limited Edition",
            "price": 2799,
            "mrp": 3999,
            "image": "https://dacby-database.web.app/cdn/Controllers%2Fps4%20valde%2Fa61d9249-55f3-4c6f-8ad9-3834a6375a55_2040x2040.png?alt=media&token=e8db939f-16f8-4b89-b5f4-f6fcdaf87d21",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 2000,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "RYUOEPMQAaKxO9xfJ6ER",
        "score": 6.909506053635807,
        "outOfStock": true,
        "product": {
            "product_title": "Ps4 Dualshock V1 Call Of Duty Limited Edition Controller",
            "price": 2999,
            "mrp": 4999,
            "image": "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/1%20NEW%20WEBSITE%20LISTING%2FControllers%2Fps4-standard-call-of-duty-limited-edition%20controller%2FX11_2040x2040.png?alt=media&token=9eba8511-829f-4043-bd04-d9857714a4bf",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 2000,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "u5Fb2fppCZtltCNG0GXb",
        "score": 6.9001911655322115,
        "outOfStock": true,
        "product": {
            "product_title": "Ps4 Dualshock V2 Starwars Battlefront Limited Edition Wireless Controller",
            "price": 2999,
            "mrp": 4999,
            "image": "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/1%20NEW%20WEBSITE%20LISTING%2FControllers%2Fps4-starwars-battlefront%20controller%2FStarxx_2040x2040.png?alt=media&token=cbc548c6-a92a-4627-8c8c-f9dcfaeb7a0e",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 2000,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "6zbrNZTfmEgnBsfcHEjD",
        "score": 6.8967021012192165,
        "outOfStock": true,
        "product": {
            "product_title": "Ps3 Controller",
            "price": 1399,
            "mrp": 2999,
            "image": "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/1%20NEW%20WEBSITE%20LISTING%2FControllers%2FPS3%20Dualshock%203%20White%20Controller%2Fyz111_2040x2040.png?alt=media&token=a2acf359-e18a-4090-aa86-dec358f83f11",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 10,
            "outOfStock": true,
            "variants": 4,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "CfGoqcxYaB6wTMsz9O8D",
        "score": 6.885901768730354,
        "outOfStock": true,
        "product": {
            "product_title": "Ps4 Dualshock V2 (500 Million) Limited Edition",
            "price": 3449,
            "mrp": 3999,
            "image": "https://dacby-database.web.app/cdn/Controllers%20new%2FPS4%20Dualshock%20V2%20(500%20million%20Blue)%201_2040x2040.png?alt=media&token=1d19782c-f182-479b-9e29-0a70279798b2",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 2550,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "McQpMuz9OOo3cQUbQR4v",
        "score": 6.868708495794829,
        "outOfStock": true,
        "product": {
            "product_title": "Ps4 Dualshock V1",
            "price": 2399,
            "mrp": 6999,
            "image": "https://dacby-database.web.app/cdn/1111111111111111111111111111111%2Fcontroller%2F6a2a75a3-8c3a-407c-9f2f-8f54ea81600e_2040x2040.png?alt=media&token=c68f4e74-e6fa-4076-a5d8-94a18b079d87",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 1650,
            "outOfStock": true,
            "variants": 11,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "NQse4YFaKXhaljyFVxmw",
        "score": 6.865407720931465,
        "outOfStock": true,
        "product": {
            "product_title": "Ps4 Dualshock V2 God Of War Limited Edition",
            "price": 3099,
            "mrp": 4999,
            "image": "https://dacby-database.web.app/cdn/Controllers%20new%2FPS4%20Dualshock%20V2%20(God%20Of%20War%20Limited%20Edition)%201_2040x2040.png?alt=media&token=85206e73-a032-41c9-ad55-89d2c85fe186",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 1950,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "CNpGQGnxkCF8VucHE3Es",
        "score": 6.864432485449935,
        "outOfStock": true,
        "product": {
            "product_title": "Ps4 Dualshock V2 (uefa Champions League Blue) Limited Edition",
            "price": 3099,
            "mrp": 3999,
            "image": "https://dacby-database.web.app/cdn/Controllers%20new%2FPS4%20Dualshock%20V2%20(UEFA%20Champions%20League%20Blue)%201_2040x2040.png?alt=media&token=2d268098-aca3-4693-b871-9925de184fc9&width=300",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 1950,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "noWxSALcmVzMyRzUoBbb",
        "score": 6.853388565463131,
        "outOfStock": true,
        "product": {
            "product_title": "Ps4 Dualshock V2 (the Last Of Us 2) Limited Edition",
            "price": 3099,
            "mrp": 4499,
            "image": "https://dacby-database.web.app/cdn/Controllers%20new%2FPS4%20Dualshock%20V2%20(The%20Last%20Of%20Us%202%20Black)%201_2040x2040.png?alt=media&token=d2220253-1c6b-463f-8a35-9b64fe072efe",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 1950,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "MIFZpfaMSYtO9IRxjuAg",
        "score": 6.850823731682033,
        "outOfStock": true,
        "product": {
            "product_title": "Ps4 Dualshock V2 Destiny 2 Limited Edition",
            "price": 2999,
            "mrp": 4499,
            "image": "https://dacby-database.web.app/cdn/Controllers%20new%2FPS4%20Dualshock%20V2%20(Destiny%202%20Limited%20Edition)%201_2040x2040.png?alt=media&token=5d0e12a0-4700-4603-9f29-5937e0bb317a",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 2200,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "jGnmtduikW83Qeg28daW",
        "score": 6.834933974513536,
        "outOfStock": true,
        "product": {
            "product_title": "Ps4 Dualshock V2 (rose Gold) Limited Edition",
            "price": 2899,
            "mrp": 3999,
            "image": "https://dacby-database.web.app/cdn/Controllers%2F100%2Fd857cecf-b0db-4c16-92bc-b1bcc68e6cd0_2040x2040.png?alt=media&token=1cf1dfd3-c681-49ca-89d2-eb9ed5a45859",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 2000,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "OCaLVTBK53qqfU5SQYSN",
        "score": 6.834524830737357,
        "outOfStock": true,
        "product": {
            "product_title": "Ps4 Dualshock V2",
            "price": 2599,
            "mrp": 7499,
            "image": "https://dacby-database.web.app/cdn/Controllers%20new%2FPS4%20Dualshock%20V2%20(Jet%20Black)%203_2040x2040.png?alt=media&token=5ed441ac-625f-4554-8fcd-0bde6b265e2c",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 1850,
            "outOfStock": true,
            "variants": 21,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "VVcxfAeAxaTguVnv447b",
        "score": 6.820627675658711,
        "outOfStock": true,
        "product": {
            "product_title": "Ps2 Controller",
            "price": 399,
            "mrp": 950,
            "image": "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/1%20NEW%20WEBSITE%20LISTING%2FControllers%2FPS2%20Controller%2FPS211_2040x2040.png?alt=media&token=f8cacdfc-7c14-4020-9ae4-f146c1104da0",
            "sell": false,
            "category": "Controllers",
            "sell_max_price": 400,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "jAy1yux9b56Om42LHHDi",
        "score": 6.818973725410638,
        "outOfStock": true,
        "product": {
            "product_title": "Ps4 Dualshock V1 Ps4 Grey 20th Anniversary (limited-edition) Controller",
            "price": 2699,
            "mrp": 3999,
            "image": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FControllers%2FCrystal%20white%20ps4%20v1%20controller%2FUntitled%20design%20(88).png?alt=media&token=5a30bbb0-e4f7-4088-bb40-115a9a6adfd9",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 1600,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "hoYg03BkKBZa3dzZTwoo",
        "score": 6.800811024759945,
        "outOfStock": true,
        "product": {
            "product_title": "Ps4 Dualshock V2 Call Of Duty Wwii Limited Edition Controller",
            "price": 2999,
            "mrp": 4999,
            "image": "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/1%20NEW%20WEBSITE%20LISTING%2FControllers%2Fps4-slim-1tb-codwwii-limited-edition%20controller%2Fwwii11_2040x2040.png?alt=media&token=9294096f-d884-4d00-abeb-576afab5198b",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 2300,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    },
    {
        "docId": "kZkoL4PqrUPKLU0ggCDl",
        "score": 6.768210996953727,
        "outOfStock": true,
        "product": {
            "product_title": "Ps4 Dualshock V2 Final Fantasy Luna Xv Limited Edition Controller",
            "price": 2999,
            "mrp": 4999,
            "image": "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/1%20NEW%20WEBSITE%20LISTING%2FControllers%2Fps4-slim-1-tb-final-fantasy-xv-luna%20Controller%2Fluna11_2040x2040.png?alt=media&token=9ae749c9-56f1-4c85-94c9-366e733416d4",
            "sell": true,
            "category": "Controllers",
            "sell_max_price": 2300,
            "outOfStock": true,
            "variants": 1,
            "condition": "Pre Owned",
            "code": "D005Y"
        }
    }
]
export const PRODUCT_DETAILS = {
  rLk0HCQMCNmuhcjzx80k: {
    // Paste the entire JSON here
    "details": {
        "category_name": "Consoles",
        "code": "D004Y",
        "mrp": 19999,
        "sell": true,
        "spec_id": "xbox-one",
        "yt_iframe": "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/Spz5olq7K1A?si=CZ1NreB9VD8K6Q4B\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
        "created_at": {
            "_seconds": 1748515224,
            "_nanoseconds": 505000000
        },
        "condition": "Pre Owned",
        "product_title": "Microsoft XBOX One",
        "rating": 4.3,
        "rating_count": 182,
        "sell_max_price": 7500,
        "updated_at": {
            "_seconds": 1770447594,
            "_nanoseconds": 495000000
        },
        "in_stock": false,
        "price": 12999,
        "vendors": {
            "VENDOR_001": {
                "name": "Dacby Technologies Pvt. Ltd.",
                "ratings": 4.7,
                "total_sales": 320,
                "vendor_id": "yyyyyyyyyyyyyyyyyyyyyyyyyyyy",
                "vendor_note": "Disc in good condition with original cover",
                "combination_offered": {
                    "combination_1": {
                        "item1": {
                            "storage": "1tb",
                            "color": "Black",
                            "sku": "xbox-one-1tb-black",
                            "images": [
                                "https://dacby-database.web.app/cdn/Banners%2FMicrosoft-Xbox-One-500-GB-Pre-owned.webp?alt=media&token=8269ea2e-9de2-4230-bc51-54dfd46bfba7"
                            ],
                            "mrp": 19999,
                            "price": 14599,
                            "sell": true,
                            "weight": 4,
                            "sell_price": 6500,
                            "rating": 4.7,
                            "rating_count": 249,
                            "accessories": {
                                "item1": {
                                    "id": "JEeaWUKuRWxP3CfvAGbd",
                                    "sku": "xbox-one-controller-1st-gen-black"
                                }
                            },
                            "stocks": 0,
                            "oneDayDelivery": true
                        }
                    },
                    "combination_2": {
                        "item1": {
                            "sku": "xbox-one-500gb-white",
                            "images": [
                                "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/1%20NEW%20WEBSITE%20LISTING%2FConsoles%2FMicrosoft%20Xbox%20One%20500%20GB%20White%2FXBOX11_2040x2040.png?alt=media&token=beab1264-1201-4266-9606-22dfc110088a",
                                "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/1%20NEW%20WEBSITE%20LISTING%2FConsoles%2FMicrosoft%20Xbox%20One%20500%20GB%20White%2FXBOX22_2040x2040.png?alt=media&token=53407c58-6753-4c03-ae07-bc065a6c62bc",
                                "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/1%20NEW%20WEBSITE%20LISTING%2FConsoles%2FMicrosoft%20Xbox%20One%20500%20GB%20White%2FXBOX33_2040x2040.png?alt=media&token=00a11c20-7ac9-4847-bc32-77fe27ad082c"
                            ],
                            "mrp": 17999,
                            "price": 14999,
                            "sell_price": 7500,
                            "weight": 3,
                            "sell": true,
                            "color": "White",
                            "storage": "500gb",
                            "accessories": {
                                "item1": {
                                    "id": "JEeaWUKuRWxP3CfvAGbd",
                                    "sku": "xbox-one-controller-1st-gen-white"
                                }
                            },
                            "stocks": 0,
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "sku": "xbox-one-500gb-black",
                            "images": [
                                "https://dacby-database.web.app/cdn/Banners%2FMicrosoft-Xbox-One-500-GB-Pre-owned.webp?alt=media&token=8269ea2e-9de2-4230-bc51-54dfd46bfba7"
                            ],
                            "mrp": 12999,
                            "price": 12999,
                            "sell_price": 5500,
                            "weight": 4,
                            "stocks": 0,
                            "sell": true,
                            "color": "Black",
                            "storage": "500gb",
                            "accessories": {
                                "item1": {
                                    "id": "JEeaWUKuRWxP3CfvAGbd",
                                    "sku": "xbox-one-controller-1st-gen-black"
                                }
                            },
                            "oneDayDelivery": true
                        }
                    }
                }
            }
        },
        "brand": "Microsoft",
        "type": "Xbox One",
        "id": "rLk0HCQMCNmuhcjzx80k",
        "extra_coins": 1000
    },
    "specifications": {
        "description": {
            "Connectivity": {
                "Bluetooth": "Not supported",
                "Ethernet": "Gigabit Ethernet",
                "HDMI": "HDMI 1.4b (out), HDMI 1.4b (in)",
                "USB": "3x USB 3.0",
                "Wi-Fi": "Wi-Fi 802.11n dual band",
                "Accessories radio": "Xbox Wireless radio"
            },
            "Design": {
                "Cooling": "Fan-based cooling system",
                "Type": "Slim",
                "Dimensions": "295 x 230 x 64 mm"
            },
            "Global_Attributes": {
                "brand": "Microsoft",
                "genre": "Console Hardware",
                "language": "All Supported",
                "mode": "Single-player, Multiplayer",
                "platform": "Xbox One S",
                "publisher": "Microsoft",
                "rating": "Everyone",
                "release_date": "August 2, 2016",
                "release_year": 2016
            },
            "Performance": {
                "CPU": "8x Jaguar Cores at 1.75GHz",
                "GPU": "1.40 TFLOPs, 12 CUs at 914MHz",
                "RAM": "8 GB DDR3",
                "Release Date": "August 2, 2016"
            },
            "Storage": {
                "rom": 1000,
                "type": "HDD"
            },
            "Weight": "2.9 kg",
            "summary": "Microsoft Xbox One S is a sleek and compact console offering enhanced visuals with HDR support, 4K video playback, and backward compatibility with Xbox One games. Buy used Xbox games, pre-owned Xbox One games, and second-hand video games in India. Sell gaming discs online and explore pre-owned PlayStation games or used console games in India with this console, perfect for enjoying used gaming discs and pre-owned gaming accessories."
        },
        "minimum_price": 2000,
        "updated_at": {
            "_seconds": 1770447544,
            "_nanoseconds": 159000000
        },
        "combination": {
            "combination_2": {
                "color": [
                    "White",
                    "Black"
                ],
                "storage": [
                    "500gb"
                ]
            },
            "combination_1": {
                "color": [
                    "Black"
                ],
                "storage": [
                    "1tb"
                ]
            }
        },
        "questions": {
            "q1": {
                "deduction": 0,
                "description": "",
                "isRequired": true,
                "options": [
                    "Yes",
                    "No"
                ],
                "type": "radio",
                "question": "Does the Console switch on?"
            },
            "q2": {
                "isRequired": false,
                "question": "Functional Condition",
                "type": "checkbox",
                "description": "Please choose issues that apply to your Console",
                "options": [
                    {
                        "icon": "Icons.disc_full",
                        "deduction": 1000,
                        "label": "Internal Fan Noise"
                    },
                    {
                        "icon": "Icons.usb",
                        "deduction": 1000,
                        "label": "Overheating"
                    },
                    {
                        "label": "HDMI Port Non-Functional / No Display Output",
                        "icon": "Icons.wifi",
                        "deduction": 2000
                    },
                    {
                        "label": "One or More USB / Charging Ports Not Functional",
                        "deduction": 2000,
                        "icon": "Icons.wifi"
                    }
                ]
            },
            "q3": {
                "description": "Accessories Missing",
                "isRequired": false,
                "question": "Do you have the following?",
                "type": "checkbox",
                "options": [
                    {
                        "label": "Cables Missing",
                        "icon": "icon.tv",
                        "deduction": 1000
                    }
                ]
            },
            "q4": {
                "isRequired": true,
                "options": [
                    "Flawless",
                    "Physical Body Damage / Dents or Cracks"
                ],
                "question": "Physical Condition",
                "type": "dropdown",
                "deduction": 1500,
                "description": "Please select your console's physical condition"
            }
        }
    }
  },
  DoSbFOsOB7nSvAHWjbqs:{
    "details": {
        "category_name": "Laptops",
        "product_title": "Apple MacBook Pro 2021 A2442 (M1 Pro, 14-inch)",
        "spec_id": "macbook-pro-14-2021-m1-pro",
        "condition": "Pre Owned",
        "sell": false,
        "sell_max_price": 15000,
        "mrp": 194900,
        "rating": 4.9,
        "rating_count": 80,
        "updated_at": {
            "_seconds": 1774679586,
            "_nanoseconds": 376000000
        },
        "created_at": {
            "_seconds": 1774679586,
            "_nanoseconds": 376000000
        },
        "code": "D018Y",
        "yt_iframe": "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/joZEP3XLGUw?si=9HliR-VR4uqMqImo\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
        "vendors": {
            "VENDOR_001": {
                "name": "Dacby Technologies Pvt. Ltd.",
                "ratings": 4.8,
                "total_sales": 120,
                "vendor_id": "yyyyyyyyyyyyyyyyyyyyyyyyyyyy",
                "vendor_note": "",
                "combination_offered": {
                    "combination_1": {
                        "item1": {
                            "price": 90000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "512GB",
                            "ram": "16GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-512gb-16gb-high-no-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 90000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "512GB",
                            "ram": "16GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-512gb-16gb-high-no-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_2": {
                        "item1": {
                            "price": 102000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "512GB",
                            "ram": "32GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-512gb-32gb-high-no-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 102000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "512GB",
                            "ram": "32GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-512gb-32gb-high-no-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_3": {
                        "item1": {
                            "price": 98000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "1TB",
                            "ram": "16GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-1tb-16gb-high-no-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 98000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "1TB",
                            "ram": "16GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-1tb-16gb-high-no-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_4": {
                        "item1": {
                            "price": 110000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "1TB",
                            "ram": "32GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-1tb-32gb-high-no-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 110000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "1TB",
                            "ram": "32GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-1tb-32gb-high-no-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_5": {
                        "item1": {
                            "price": 108000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "2TB",
                            "ram": "16GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-2tb-16gb-high-no-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 108000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "2TB",
                            "ram": "16GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-2tb-16gb-high-no-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_6": {
                        "item1": {
                            "price": 120000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "2TB",
                            "ram": "32GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-2tb-32gb-high-no-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 120000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "2TB",
                            "ram": "32GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-2tb-32gb-high-no-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_7": {
                        "item1": {
                            "price": 120000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "4TB",
                            "ram": "16GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-4tb-16gb-high-no-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 120000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "4TB",
                            "ram": "16GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-4tb-16gb-high-no-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_8": {
                        "item1": {
                            "price": 132000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "4TB",
                            "ram": "32GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-4tb-32gb-high-no-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 132000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "4TB",
                            "ram": "32GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-4tb-32gb-high-no-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_12": {
                        "item1": {
                            "price": 104000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "1TB",
                            "ram": "32GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-1tb-32gb-high-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 104000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "1TB",
                            "ram": "32GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-1tb-32gb-high-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_13": {
                        "item1": {
                            "price": 102000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "2TB",
                            "ram": "16GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-2tb-16gb-high-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 102000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "2TB",
                            "ram": "16GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-2tb-16gb-high-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_14": {
                        "item1": {
                            "price": 114000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "2TB",
                            "ram": "32GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-2tb-32gb-high-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 114000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "2TB",
                            "ram": "32GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-2tb-32gb-high-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_15": {
                        "item1": {
                            "price": 114000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "4TB",
                            "ram": "16GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-4tb-16gb-high-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 114000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "4TB",
                            "ram": "16GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-4tb-16gb-high-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_16": {
                        "item1": {
                            "price": 126000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "4TB",
                            "ram": "32GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-4tb-32gb-high-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 126000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "4TB",
                            "ram": "32GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-4tb-32gb-high-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_17": {
                        "item1": {
                            "price": 85000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "512GB",
                            "ram": "16GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-512gb-16gb-low-no-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 85000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "512GB",
                            "ram": "16GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-512gb-16gb-low-no-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_18": {
                        "item1": {
                            "price": 97000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "512GB",
                            "ram": "32GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-512gb-32gb-low-no-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 97000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "512GB",
                            "ram": "32GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-512gb-32gb-low-no-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_19": {
                        "item1": {
                            "price": 93000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "1TB",
                            "ram": "16GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-1tb-16gb-low-no-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 93000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "1TB",
                            "ram": "16GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-1tb-16gb-low-no-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_20": {
                        "item1": {
                            "price": 105000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "1TB",
                            "ram": "32GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-1tb-32gb-low-no-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 105000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "1TB",
                            "ram": "32GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-1tb-32gb-low-no-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_21": {
                        "item1": {
                            "price": 103000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "2TB",
                            "ram": "16GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-2tb-16gb-low-no-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 103000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "2TB",
                            "ram": "16GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-2tb-16gb-low-no-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_22": {
                        "item1": {
                            "price": 115000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "2TB",
                            "ram": "32GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-2tb-32gb-low-no-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 115000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "2TB",
                            "ram": "32GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-2tb-32gb-low-no-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_23": {
                        "item1": {
                            "price": 115000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "4TB",
                            "ram": "16GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-4tb-16gb-low-no-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 115000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "4TB",
                            "ram": "16GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-4tb-16gb-low-no-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_24": {
                        "item1": {
                            "price": 127000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "4TB",
                            "ram": "32GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-4tb-32gb-low-no-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 127000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "4TB",
                            "ram": "32GB",
                            "physical_condition": "Very Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-4tb-32gb-low-no-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_25": {
                        "item1": {
                            "price": 79000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "512GB",
                            "ram": "16GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-512gb-16gb-low-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 79000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "512GB",
                            "ram": "16GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-512gb-16gb-low-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_26": {
                        "item1": {
                            "price": 91000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "512GB",
                            "ram": "32GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-512gb-32gb-low-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 91000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "512GB",
                            "ram": "32GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-512gb-32gb-low-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_27": {
                        "item1": {
                            "price": 87000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "1TB",
                            "ram": "16GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-1tb-16gb-low-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 87000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "1TB",
                            "ram": "16GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-1tb-16gb-low-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_28": {
                        "item1": {
                            "price": 99000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "1TB",
                            "ram": "32GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-1tb-32gb-low-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 99000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "1TB",
                            "ram": "32GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-1tb-32gb-low-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_29": {
                        "item1": {
                            "price": 97000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "2TB",
                            "ram": "16GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-2tb-16gb-low-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 97000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "2TB",
                            "ram": "16GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-2tb-16gb-low-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_30": {
                        "item1": {
                            "price": 109000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "2TB",
                            "ram": "32GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-2tb-32gb-low-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 109000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "2TB",
                            "ram": "32GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-2tb-32gb-low-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_31": {
                        "item1": {
                            "price": 109000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "4TB",
                            "ram": "16GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-4tb-16gb-low-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 109000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "4TB",
                            "ram": "16GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-4tb-16gb-low-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_32": {
                        "item1": {
                            "price": 121000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "4TB",
                            "ram": "32GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-4tb-32gb-low-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "price": 121000,
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "4TB",
                            "ram": "32GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "75%-84%",
                            "sku": "macbook-pro-14-2021-m1-pro-4tb-32gb-low-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "oneDayDelivery": true
                        }
                    },
                    "combination_11": {
                        "item2": {
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "1TB",
                            "ram": "16GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-1tb-16gb-high-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "price": 74994,
                            "oneDayDelivery": true
                        },
                        "item1": {
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "1TB",
                            "ram": "16GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-1tb-16gb-high-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "price": 74999,
                            "oneDayDelivery": true
                        }
                    },
                    "combination_10": {
                        "item2": {
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "512GB",
                            "ram": "32GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-512gb-32gb-high-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "price": 79999,
                            "stocks": 0,
                            "oneDayDelivery": true
                        },
                        "item1": {
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "512GB",
                            "ram": "32GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-512gb-32gb-high-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "price": 79999,
                            "stocks": 0,
                            "oneDayDelivery": true
                        }
                    },
                    "combination_9": {
                        "item2": {
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "512GB",
                            "ram": "16GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-512gb-16gb-high-visible-mark-spacegray",
                            "color": "Space Gray",
                            "sell": false,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(11).png?alt=media&token=d4265b32-0588-470f-973f-54515c21ea13",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Space%20Grey%2FUntitled%20design%20(14).png?alt=media&token=5ba7a88c-c7cd-4280-accd-2b6fd20b1d98"
                            ],
                            "price": 74999,
                            "stocks": 0,
                            "oneDayDelivery": true
                        },
                        "item1": {
                            "mrp": 194900,
                            "sell_price": 15000,
                            "weight": 1,
                            "storage": "512GB",
                            "ram": "16GB",
                            "physical_condition": "Light Marks",
                            "battery_health": "85%-100%",
                            "sku": "macbook-pro-14-2021-m1-pro-512gb-16gb-high-visible-mark-silver",
                            "color": "Silver",
                            "sell": false,
                            "rating": 4.9,
                            "rating_count": 80,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(19).png?alt=media&token=8a40b572-7fa4-4ddb-ad68-bc2636d95e73",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FLaptops%2FApple%20MacBook%20Pro%202021%20A2442%20(Apple%20M1%20Pro%20Chip%2014%20Inch)-%20%20Silver%2FUntitled%20design%20(20).png?alt=media&token=cf9e8263-f786-40d3-9ad4-7d1ff3afd2e8"
                            ],
                            "price": 74999,
                            "stocks": 0,
                            "oneDayDelivery": true
                        }
                    }
                }
            }
        },
        "in_stock": false,
        "price": 74994,
        "id": "DoSbFOsOB7nSvAHWjbqs",
        "extra_coins": 0
    },
    "specifications": {
        "description": {
            "Connectivity": {
                "Ports": "3 × Thunderbolt 4 (USB-C), HDMI 2.0, SDXC card slot, MagSafe 3 charging port, 3.5mm headphone jack",
                "Wireless": "Wi-Fi 6 (802.11ax), Bluetooth 5.0"
            },
            "Design": {
                "Body_Type": "Laptop",
                "Construction": "Aluminum unibody design",
                "Dimensions": "312.6 × 221.2 × 15.5 mm",
                "Weight": "Approx. 1.6 kg"
            },
            "Global_Attributes": {
                "brand": "Apple",
                "genre": "Laptop",
                "type": "Pro Laptop",
                "model": "MacBook Pro 14-inch M1 Pro (A2442)",
                "platform": "macOS",
                "release_date": "October 2021",
                "release_year": 2021
            },
            "Performance": {
                "Processor": "Apple M1 Pro chip (8-core or 10-core CPU)",
                "GPU": "14-core or 16-core GPU",
                "Neural_Engine": "16-core Neural Engine",
                "RAM": "16GB / 32GB unified memory",
                "Storage": "512GB / 1TB / 2TB / 4TB SSD",
                "Display": "14.2-inch Liquid Retina XDR display (3024 × 1964), ProMotion 120Hz",
                "Battery": "Up to 17 hours battery life, 70Wh",
                "Camera": "1080p FaceTime HD camera",
                "Audio": "Six-speaker sound system with Spatial Audio, studio-quality three-mic array",
                "Keyboard": "Magic Keyboard with Touch ID and ambient light sensor",
                "Features": "MagSafe 3 charging, ProMotion adaptive refresh rate, miniLED backlight, 1600 nits peak brightness"
            },
            "summary": "The Apple MacBook Pro 14-inch (2021) with M1 Pro chip delivers professional-grade performance with its stunning Liquid Retina XDR ProMotion display, long battery life, and a versatile port selection including HDMI and SD card slot. Ideal for developers, video editors, and creative professionals."
        },
        "minimum_price": 80000,
        "color_codes": {
            "Silver": "#C0C0C0",
            "Starlight": "#ffecaf",
            "Midnight": "#2C3E50",
            "Space_Gray": "#5B5B5B"
        },
        "configuration_icons": {
            "Storage": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fstorage_icon.png?alt=media&token=06fd3c54-774f-404c-b721-219274614ceb",
            "Ram": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fram_icon.png?alt=media&token=7dae249e-1fb1-4ce2-9ce8-0fbba3ff572d",
            "Physical Condition": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fphysical_condition_icon.png?alt=media&token=1d568f91-0c48-49ff-a2c7-4c36710b3360",
            "Battery health": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fbattery_health_icon.png?alt=media&token=b26ade4a-433c-40db-9ee5-1994d81e4b3b"
        },
        "combination": {
            "combination_1": {
                "battery_health": [
                    "85%-100%"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "storage": [
                    "512GB"
                ],
                "ram": [
                    "16GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_2": {
                "battery_health": [
                    "85%-100%"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "storage": [
                    "512GB"
                ],
                "ram": [
                    "32GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_3": {
                "battery_health": [
                    "85%-100%"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "storage": [
                    "1TB"
                ],
                "ram": [
                    "16GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_4": {
                "battery_health": [
                    "85%-100%"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "storage": [
                    "1TB"
                ],
                "ram": [
                    "32GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_5": {
                "battery_health": [
                    "85%-100%"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "storage": [
                    "2TB"
                ],
                "ram": [
                    "16GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_6": {
                "battery_health": [
                    "85%-100%"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "storage": [
                    "2TB"
                ],
                "ram": [
                    "32GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_7": {
                "battery_health": [
                    "85%-100%"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "storage": [
                    "4TB"
                ],
                "ram": [
                    "16GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_8": {
                "battery_health": [
                    "85%-100%"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "storage": [
                    "4TB"
                ],
                "ram": [
                    "32GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_9": {
                "battery_health": [
                    "85%-100%"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "storage": [
                    "512GB"
                ],
                "ram": [
                    "16GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_10": {
                "battery_health": [
                    "85%-100%"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "storage": [
                    "512GB"
                ],
                "ram": [
                    "32GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_11": {
                "battery_health": [
                    "85%-100%"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "storage": [
                    "1TB"
                ],
                "ram": [
                    "16GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_12": {
                "battery_health": [
                    "85%-100%"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "storage": [
                    "1TB"
                ],
                "ram": [
                    "32GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_13": {
                "battery_health": [
                    "85%-100%"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "storage": [
                    "2TB"
                ],
                "ram": [
                    "16GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_14": {
                "battery_health": [
                    "85%-100%"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "storage": [
                    "2TB"
                ],
                "ram": [
                    "32GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_15": {
                "battery_health": [
                    "85%-100%"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "storage": [
                    "4TB"
                ],
                "ram": [
                    "16GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_16": {
                "battery_health": [
                    "85%-100%"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "storage": [
                    "4TB"
                ],
                "ram": [
                    "32GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_17": {
                "battery_health": [
                    "75%-84%"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "storage": [
                    "512GB"
                ],
                "ram": [
                    "16GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_18": {
                "battery_health": [
                    "75%-84%"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "storage": [
                    "512GB"
                ],
                "ram": [
                    "32GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_19": {
                "battery_health": [
                    "75%-84%"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "storage": [
                    "1TB"
                ],
                "ram": [
                    "16GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_20": {
                "battery_health": [
                    "75%-84%"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "storage": [
                    "1TB"
                ],
                "ram": [
                    "32GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_21": {
                "battery_health": [
                    "75%-84%"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "storage": [
                    "2TB"
                ],
                "ram": [
                    "16GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_22": {
                "battery_health": [
                    "75%-84%"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "storage": [
                    "2TB"
                ],
                "ram": [
                    "32GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_23": {
                "battery_health": [
                    "75%-84%"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "storage": [
                    "4TB"
                ],
                "ram": [
                    "16GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_24": {
                "battery_health": [
                    "75%-84%"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "storage": [
                    "4TB"
                ],
                "ram": [
                    "32GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_25": {
                "battery_health": [
                    "75%-84%"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "storage": [
                    "512GB"
                ],
                "ram": [
                    "16GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_26": {
                "battery_health": [
                    "75%-84%"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "storage": [
                    "512GB"
                ],
                "ram": [
                    "32GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_27": {
                "battery_health": [
                    "75%-84%"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "storage": [
                    "1TB"
                ],
                "ram": [
                    "16GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_28": {
                "battery_health": [
                    "75%-84%"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "storage": [
                    "1TB"
                ],
                "ram": [
                    "32GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_29": {
                "battery_health": [
                    "75%-84%"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "storage": [
                    "2TB"
                ],
                "ram": [
                    "16GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_30": {
                "battery_health": [
                    "75%-84%"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "storage": [
                    "2TB"
                ],
                "ram": [
                    "32GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_31": {
                "battery_health": [
                    "75%-84%"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "storage": [
                    "4TB"
                ],
                "ram": [
                    "16GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            },
            "combination_32": {
                "battery_health": [
                    "75%-84%"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "storage": [
                    "4TB"
                ],
                "ram": [
                    "32GB"
                ],
                "color": [
                    "Silver",
                    "Space Gray"
                ]
            }
        },
        "option_descriptions": {
            "Visible Marks": "Visible scratches or scuffs noticeable in regular use. May have a light dent or two. Fully functional, just not pristine.",
            "No Visible Marks": "Minor surface scratches or scuffs that are only noticeable under close inspection. No dents, no deep scratches. Looks great from a normal viewing distance.",
            "Low Visible Marks": "Minor surface scratches or scuffs that are only noticeable under close inspection. No dents, no deep scratches. Looks great from a normal viewing distance.",
            "Medium Visible Marks": "Visible scratches or scuffs noticeable in regular use. May have a light dent or two. Fully functional, just not pristine.",
            "Light Visible Marks": "Minor surface scratches or scuffs that are only noticeable under close inspection. No dents, no deep scratches. Looks great from a normal viewing distance.",
            "Very Light Marks": "Looks and feels almost new. Any marks are so faint they're only noticeable under direct light or at very close range. Nothing you'd spot in regular use.",
            "Light Marks": "Has minor marks from everyday use, the kind you'd expect on a well-cared-for device. Looks clean from a normal distance. No dents, no deep scratches."
        },
        "questions": {
            "q1": {
                "deduction": 0,
                "isRequired": true,
                "options": [
                    "Yes",
                    "No"
                ],
                "question": "Does the MacBook power on and function properly (display, keyboard, trackpad)?",
                "type": "radio"
            },
            "q2": {
                "deduction": 0,
                "isRequired": true,
                "options": [
                    "Yes",
                    "No"
                ],
                "question": "Are there any hardware issues (battery, heating, speaker, ports)?",
                "type": "radio"
            },
            "q3": {
                "description": "Please choose the accessories missing",
                "isRequired": false,
                "options": [
                    {
                        "deduction": 2000,
                        "icon": "Icons.adapter",
                        "label": "Charging Adapter Missing"
                    },
                    {
                        "deduction": 1000,
                        "icon": "Icons.cable",
                        "label": "MagSafe 3 Cable Missing"
                    },
                    {
                        "deduction": 2500,
                        "icon": "Icons.box",
                        "label": "Original Box Missing"
                    }
                ],
                "question": "Accessories Missing",
                "type": "checkbox"
            }
        }
    }
  },
  aJRqoPbV7y5s3AWDGGyc:{
     "details": {
        "category_name": "Smartphones",
        "code": "D019Y",
        "product_title": "Apple iPhone 14",
        "spec_id": "iphone-14",
        "condition": "Pre Owned",
        "sell": false,
        "sell_max_price": 10000,
        "rating": 4.8,
        "rating_count": 190,
        "yt_iframe": "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/H58hEERXo18?si=E476zfKwHDj1dPYf\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
        "updated_at": {
            "_seconds": 1771432329,
            "_nanoseconds": 316000000
        },
        "created_at": {
            "_seconds": 1771432329,
            "_nanoseconds": 316000000
        },
        "price": 33899,
        "mrp": 89900,
        "in_stock": false,
        "vendors": {
            "VENDOR_001": {
                "name": "Dacby Technologies Pvt. Ltd.",
                "ratings": 4.7,
                "total_sales": 320,
                "vendor_id": "yyyyyyyyyyyyyyyyyyyyyyyyyyyy",
                "vendor_note": "",
                "combination_offered": {
                    "combination_10": {
                        "item2": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-128gb-low-no-visible-marks-red",
                            "color": "Red",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red11_2040x2040.jpg?alt=media&token=e4fca45e-feeb-4af5-8d36-9ff27e8f0887",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red22_2040x2040.png?alt=media&token=8840d633-dbd2-476b-9d46-5dd23b44662c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red33_2040x2040.png?alt=media&token=7a739c85-ad14-42cb-8ac2-d67a4ef40b0a",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red441_2040x2040.jpg?alt=media&token=33b84d5d-687a-4902-940e-9985c0d9d633"
                            ],
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        },
                        "item1": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-128gb-low-no-visible-marks-midnight",
                            "color": "Midnight",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight11_2040x2040.jpg?alt=media&token=96844a23-c0c5-4450-a553-2309ac62d58e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight22_2040x2040.png?alt=media&token=57349c4a-56ad-42f3-9a44-212111ad95ca",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight33_2040x2040.png?alt=media&token=50b4cf56-0ad7-44b2-bbce-80a81b635471",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight441_2040x2040.jpg?alt=media&token=d4de15d1-f7ad-4d34-8b9a-a027d2bd60f8"
                            ],
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        },
                        "item4": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-128gb-low-no-visible-marks-starlight",
                            "color": "Starlight",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight11_2040x2040.jpg?alt=media&token=a0b26e54-8f07-4993-9471-0d76a13d2881",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight22_2040x2040.png?alt=media&token=65bb35df-16e7-4a78-b475-0927a3529732",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight33_2040x2040.png?alt=media&token=7f19db0f-b50e-4c08-8ff4-d755505534bc",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight441_2040x2040.jpg?alt=media&token=54f5e13e-b750-4615-b3a8-c592e0609003"
                            ],
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        },
                        "item3": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-128gb-low-no-visible-marks-blue",
                            "color": "Blue",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue11_2040x2040.jpg?alt=media&token=fd10f5f0-5e0f-469f-89a9-1ad3aad37b05",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%2022_2040x2040.png?alt=media&token=fdc7184f-7e02-481e-b18d-8983e769fc11",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue33_2040x2040.png?alt=media&token=76a879ea-d545-4c3b-8a01-6cc0e99ad979",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%20441_2040x2040.jpg?alt=media&token=747b6d6c-e0c4-4272-b391-272b4508b1bf"
                            ],
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        },
                        "item6": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-128gb-low-no-visible-marks-purple",
                            "color": "Purple",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple11_2040x2040.jpg?alt=media&token=195288af-7e2c-49ae-b664-82b669b61842",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple22_2040x2040.png?alt=media&token=a7668787-e9a7-437c-8499-839291c4066e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple33_2040x2040.png?alt=media&token=79438986-eb39-45e6-9450-cb6e2473c647",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple%20441_2040x2040.jpg?alt=media&token=29b13e09-4c8d-4df0-b793-8b8e06865ac7"
                            ],
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        },
                        "item5": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-128gb-low-no-visible-marks-yellow",
                            "color": "Yellow",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow11_2040x2040.jpg?alt=media&token=1d9d5e9d-3ee8-42c7-a9b8-00f8df15f483",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow22_2040x2040.png?alt=media&token=1a55190f-3fa9-4601-9cd7-39c5e1c372a1",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow33_2040x2040.png?alt=media&token=7dfdaf22-b590-4edd-a855-e08c33e2748c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow44_2040x2040.png?alt=media&token=8e442a04-b76f-4e7f-a947-9ed09625c31d"
                            ],
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        }
                    },
                    "combination_8": {
                        "item2": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-256gb-low-visible-marks-red",
                            "color": "Red",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red11_2040x2040.jpg?alt=media&token=e4fca45e-feeb-4af5-8d36-9ff27e8f0887",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red22_2040x2040.png?alt=media&token=8840d633-dbd2-476b-9d46-5dd23b44662c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red33_2040x2040.png?alt=media&token=7a739c85-ad14-42cb-8ac2-d67a4ef40b0a",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red441_2040x2040.jpg?alt=media&token=33b84d5d-687a-4902-940e-9985c0d9d633"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        },
                        "item1": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-256gb-low-visible-marks-midnight",
                            "color": "Midnight",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight11_2040x2040.jpg?alt=media&token=96844a23-c0c5-4450-a553-2309ac62d58e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight22_2040x2040.png?alt=media&token=57349c4a-56ad-42f3-9a44-212111ad95ca",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight33_2040x2040.png?alt=media&token=50b4cf56-0ad7-44b2-bbce-80a81b635471",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight441_2040x2040.jpg?alt=media&token=d4de15d1-f7ad-4d34-8b9a-a027d2bd60f8"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        },
                        "item4": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-256gb-low-visible-marks-starlight",
                            "color": "Starlight",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight11_2040x2040.jpg?alt=media&token=a0b26e54-8f07-4993-9471-0d76a13d2881",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight22_2040x2040.png?alt=media&token=65bb35df-16e7-4a78-b475-0927a3529732",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight33_2040x2040.png?alt=media&token=7f19db0f-b50e-4c08-8ff4-d755505534bc",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight441_2040x2040.jpg?alt=media&token=54f5e13e-b750-4615-b3a8-c592e0609003"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        },
                        "item3": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-256gb-low-visible-marks-blue",
                            "color": "Blue",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue11_2040x2040.jpg?alt=media&token=fd10f5f0-5e0f-469f-89a9-1ad3aad37b05",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%2022_2040x2040.png?alt=media&token=fdc7184f-7e02-481e-b18d-8983e769fc11",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue33_2040x2040.png?alt=media&token=76a879ea-d545-4c3b-8a01-6cc0e99ad979",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%20441_2040x2040.jpg?alt=media&token=747b6d6c-e0c4-4272-b391-272b4508b1bf"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        },
                        "item6": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-256gb-low-visible-marks-purple",
                            "color": "Purple",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple11_2040x2040.jpg?alt=media&token=195288af-7e2c-49ae-b664-82b669b61842",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple22_2040x2040.png?alt=media&token=a7668787-e9a7-437c-8499-839291c4066e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple33_2040x2040.png?alt=media&token=79438986-eb39-45e6-9450-cb6e2473c647",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple%20441_2040x2040.jpg?alt=media&token=29b13e09-4c8d-4df0-b793-8b8e06865ac7"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        },
                        "item5": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-256gb-low-visible-marks-yellow",
                            "color": "Yellow",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow11_2040x2040.jpg?alt=media&token=1d9d5e9d-3ee8-42c7-a9b8-00f8df15f483",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow22_2040x2040.png?alt=media&token=1a55190f-3fa9-4601-9cd7-39c5e1c372a1",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow33_2040x2040.png?alt=media&token=7dfdaf22-b590-4edd-a855-e08c33e2748c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow44_2040x2040.png?alt=media&token=8e442a04-b76f-4e7f-a947-9ed09625c31d"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        }
                    },
                    "combination_9": {
                        "item2": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-512gb-low-visible-marks-red",
                            "color": "Red",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red11_2040x2040.jpg?alt=media&token=e4fca45e-feeb-4af5-8d36-9ff27e8f0887",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red22_2040x2040.png?alt=media&token=8840d633-dbd2-476b-9d46-5dd23b44662c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red33_2040x2040.png?alt=media&token=7a739c85-ad14-42cb-8ac2-d67a4ef40b0a",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red441_2040x2040.jpg?alt=media&token=33b84d5d-687a-4902-940e-9985c0d9d633"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        },
                        "item1": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-512gb-low-visible-marks-midnight",
                            "color": "Midnight",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight11_2040x2040.jpg?alt=media&token=96844a23-c0c5-4450-a553-2309ac62d58e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight22_2040x2040.png?alt=media&token=57349c4a-56ad-42f3-9a44-212111ad95ca",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight33_2040x2040.png?alt=media&token=50b4cf56-0ad7-44b2-bbce-80a81b635471",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight441_2040x2040.jpg?alt=media&token=d4de15d1-f7ad-4d34-8b9a-a027d2bd60f8"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        },
                        "item4": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-512gb-low-visible-marks-starlight",
                            "color": "Starlight",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight11_2040x2040.jpg?alt=media&token=a0b26e54-8f07-4993-9471-0d76a13d2881",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight22_2040x2040.png?alt=media&token=65bb35df-16e7-4a78-b475-0927a3529732",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight33_2040x2040.png?alt=media&token=7f19db0f-b50e-4c08-8ff4-d755505534bc",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight441_2040x2040.jpg?alt=media&token=54f5e13e-b750-4615-b3a8-c592e0609003"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        },
                        "item3": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-512gb-low-visible-marks-blue",
                            "color": "Blue",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue11_2040x2040.jpg?alt=media&token=fd10f5f0-5e0f-469f-89a9-1ad3aad37b05",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%2022_2040x2040.png?alt=media&token=fdc7184f-7e02-481e-b18d-8983e769fc11",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue33_2040x2040.png?alt=media&token=76a879ea-d545-4c3b-8a01-6cc0e99ad979",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%20441_2040x2040.jpg?alt=media&token=747b6d6c-e0c4-4272-b391-272b4508b1bf"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        },
                        "item6": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-512gb-low-visible-marks-purple",
                            "color": "Purple",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple11_2040x2040.jpg?alt=media&token=195288af-7e2c-49ae-b664-82b669b61842",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple22_2040x2040.png?alt=media&token=a7668787-e9a7-437c-8499-839291c4066e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple33_2040x2040.png?alt=media&token=79438986-eb39-45e6-9450-cb6e2473c647",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple%20441_2040x2040.jpg?alt=media&token=29b13e09-4c8d-4df0-b793-8b8e06865ac7"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        },
                        "item5": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-512gb-low-visible-marks-yellow",
                            "color": "Yellow",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow11_2040x2040.jpg?alt=media&token=1d9d5e9d-3ee8-42c7-a9b8-00f8df15f483",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow22_2040x2040.png?alt=media&token=1a55190f-3fa9-4601-9cd7-39c5e1c372a1",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow33_2040x2040.png?alt=media&token=7dfdaf22-b590-4edd-a855-e08c33e2748c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow44_2040x2040.png?alt=media&token=8e442a04-b76f-4e7f-a947-9ed09625c31d"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        }
                    },
                    "combination_4": {
                        "item2": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-128gb-high-visible-marks-red",
                            "color": "Red",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red11_2040x2040.jpg?alt=media&token=e4fca45e-feeb-4af5-8d36-9ff27e8f0887",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red22_2040x2040.png?alt=media&token=8840d633-dbd2-476b-9d46-5dd23b44662c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red33_2040x2040.png?alt=media&token=7a739c85-ad14-42cb-8ac2-d67a4ef40b0a",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red441_2040x2040.jpg?alt=media&token=33b84d5d-687a-4902-940e-9985c0d9d633"
                            ],
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        },
                        "item1": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-128gb-high-visible-marks-midnight",
                            "color": "Midnight",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight11_2040x2040.jpg?alt=media&token=96844a23-c0c5-4450-a553-2309ac62d58e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight22_2040x2040.png?alt=media&token=57349c4a-56ad-42f3-9a44-212111ad95ca",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight33_2040x2040.png?alt=media&token=50b4cf56-0ad7-44b2-bbce-80a81b635471",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight441_2040x2040.jpg?alt=media&token=d4de15d1-f7ad-4d34-8b9a-a027d2bd60f8"
                            ],
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        },
                        "item4": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-128gb-high-visible-marks-starlight",
                            "color": "Starlight",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight11_2040x2040.jpg?alt=media&token=a0b26e54-8f07-4993-9471-0d76a13d2881",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight22_2040x2040.png?alt=media&token=65bb35df-16e7-4a78-b475-0927a3529732",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight33_2040x2040.png?alt=media&token=7f19db0f-b50e-4c08-8ff4-d755505534bc",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight441_2040x2040.jpg?alt=media&token=54f5e13e-b750-4615-b3a8-c592e0609003"
                            ],
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        },
                        "item3": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-128gb-high-visible-marks-blue",
                            "color": "Blue",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue11_2040x2040.jpg?alt=media&token=fd10f5f0-5e0f-469f-89a9-1ad3aad37b05",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%2022_2040x2040.png?alt=media&token=fdc7184f-7e02-481e-b18d-8983e769fc11",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue33_2040x2040.png?alt=media&token=76a879ea-d545-4c3b-8a01-6cc0e99ad979",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%20441_2040x2040.jpg?alt=media&token=747b6d6c-e0c4-4272-b391-272b4508b1bf"
                            ],
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        },
                        "item6": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-128gb-high-visible-marks-purple",
                            "color": "Purple",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple11_2040x2040.jpg?alt=media&token=195288af-7e2c-49ae-b664-82b669b61842",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple22_2040x2040.png?alt=media&token=a7668787-e9a7-437c-8499-839291c4066e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple33_2040x2040.png?alt=media&token=79438986-eb39-45e6-9450-cb6e2473c647",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple%20441_2040x2040.jpg?alt=media&token=29b13e09-4c8d-4df0-b793-8b8e06865ac7"
                            ],
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        },
                        "item5": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-128gb-high-visible-marks-yellow",
                            "color": "Yellow",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow11_2040x2040.jpg?alt=media&token=1d9d5e9d-3ee8-42c7-a9b8-00f8df15f483",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow22_2040x2040.png?alt=media&token=1a55190f-3fa9-4601-9cd7-39c5e1c372a1",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow33_2040x2040.png?alt=media&token=7dfdaf22-b590-4edd-a855-e08c33e2748c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow44_2040x2040.png?alt=media&token=8e442a04-b76f-4e7f-a947-9ed09625c31d"
                            ],
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        }
                    },
                    "combination_5": {
                        "item2": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-256gb-high-visible-marks-red",
                            "color": "Red",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red11_2040x2040.jpg?alt=media&token=e4fca45e-feeb-4af5-8d36-9ff27e8f0887",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red22_2040x2040.png?alt=media&token=8840d633-dbd2-476b-9d46-5dd23b44662c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red33_2040x2040.png?alt=media&token=7a739c85-ad14-42cb-8ac2-d67a4ef40b0a",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red441_2040x2040.jpg?alt=media&token=33b84d5d-687a-4902-940e-9985c0d9d633"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        },
                        "item1": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-256gb-high-visible-marks-midnight",
                            "color": "Midnight",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight11_2040x2040.jpg?alt=media&token=96844a23-c0c5-4450-a553-2309ac62d58e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight22_2040x2040.png?alt=media&token=57349c4a-56ad-42f3-9a44-212111ad95ca",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight33_2040x2040.png?alt=media&token=50b4cf56-0ad7-44b2-bbce-80a81b635471",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight441_2040x2040.jpg?alt=media&token=d4de15d1-f7ad-4d34-8b9a-a027d2bd60f8"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        },
                        "item4": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-256gb-high-visible-marks-starlight",
                            "color": "Starlight",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight11_2040x2040.jpg?alt=media&token=a0b26e54-8f07-4993-9471-0d76a13d2881",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight22_2040x2040.png?alt=media&token=65bb35df-16e7-4a78-b475-0927a3529732",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight33_2040x2040.png?alt=media&token=7f19db0f-b50e-4c08-8ff4-d755505534bc",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight441_2040x2040.jpg?alt=media&token=54f5e13e-b750-4615-b3a8-c592e0609003"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        },
                        "item3": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-256gb-high-visible-marks-blue",
                            "color": "Blue",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue11_2040x2040.jpg?alt=media&token=fd10f5f0-5e0f-469f-89a9-1ad3aad37b05",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%2022_2040x2040.png?alt=media&token=fdc7184f-7e02-481e-b18d-8983e769fc11",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue33_2040x2040.png?alt=media&token=76a879ea-d545-4c3b-8a01-6cc0e99ad979",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%20441_2040x2040.jpg?alt=media&token=747b6d6c-e0c4-4272-b391-272b4508b1bf"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        },
                        "item6": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-256gb-high-visible-marks-purple",
                            "color": "Purple",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple11_2040x2040.jpg?alt=media&token=195288af-7e2c-49ae-b664-82b669b61842",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple22_2040x2040.png?alt=media&token=a7668787-e9a7-437c-8499-839291c4066e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple33_2040x2040.png?alt=media&token=79438986-eb39-45e6-9450-cb6e2473c647",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple%20441_2040x2040.jpg?alt=media&token=29b13e09-4c8d-4df0-b793-8b8e06865ac7"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        },
                        "item5": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-256gb-high-visible-marks-yellow",
                            "color": "Yellow",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow11_2040x2040.jpg?alt=media&token=1d9d5e9d-3ee8-42c7-a9b8-00f8df15f483",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow22_2040x2040.png?alt=media&token=1a55190f-3fa9-4601-9cd7-39c5e1c372a1",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow33_2040x2040.png?alt=media&token=7dfdaf22-b590-4edd-a855-e08c33e2748c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow44_2040x2040.png?alt=media&token=8e442a04-b76f-4e7f-a947-9ed09625c31d"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        }
                    },
                    "combination_6": {
                        "item2": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-512gb-high-visible-marks-red",
                            "color": "Red",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red11_2040x2040.jpg?alt=media&token=e4fca45e-feeb-4af5-8d36-9ff27e8f0887",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red22_2040x2040.png?alt=media&token=8840d633-dbd2-476b-9d46-5dd23b44662c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red33_2040x2040.png?alt=media&token=7a739c85-ad14-42cb-8ac2-d67a4ef40b0a",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red441_2040x2040.jpg?alt=media&token=33b84d5d-687a-4902-940e-9985c0d9d633"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        },
                        "item1": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-512gb-high-visible-marks-midnight",
                            "color": "Midnight",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight11_2040x2040.jpg?alt=media&token=96844a23-c0c5-4450-a553-2309ac62d58e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight22_2040x2040.png?alt=media&token=57349c4a-56ad-42f3-9a44-212111ad95ca",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight33_2040x2040.png?alt=media&token=50b4cf56-0ad7-44b2-bbce-80a81b635471",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight441_2040x2040.jpg?alt=media&token=d4de15d1-f7ad-4d34-8b9a-a027d2bd60f8"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        },
                        "item4": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-512gb-high-visible-marks-starlight",
                            "color": "Starlight",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight11_2040x2040.jpg?alt=media&token=a0b26e54-8f07-4993-9471-0d76a13d2881",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight22_2040x2040.png?alt=media&token=65bb35df-16e7-4a78-b475-0927a3529732",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight33_2040x2040.png?alt=media&token=7f19db0f-b50e-4c08-8ff4-d755505534bc",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight441_2040x2040.jpg?alt=media&token=54f5e13e-b750-4615-b3a8-c592e0609003"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        },
                        "item3": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-512gb-high-visible-marks-blue",
                            "color": "Blue",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue11_2040x2040.jpg?alt=media&token=fd10f5f0-5e0f-469f-89a9-1ad3aad37b05",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%2022_2040x2040.png?alt=media&token=fdc7184f-7e02-481e-b18d-8983e769fc11",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue33_2040x2040.png?alt=media&token=76a879ea-d545-4c3b-8a01-6cc0e99ad979",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%20441_2040x2040.jpg?alt=media&token=747b6d6c-e0c4-4272-b391-272b4508b1bf"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        },
                        "item6": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-512gb-high-visible-marks-purple",
                            "color": "Purple",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple11_2040x2040.jpg?alt=media&token=195288af-7e2c-49ae-b664-82b669b61842",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple22_2040x2040.png?alt=media&token=a7668787-e9a7-437c-8499-839291c4066e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple33_2040x2040.png?alt=media&token=79438986-eb39-45e6-9450-cb6e2473c647",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple%20441_2040x2040.jpg?alt=media&token=29b13e09-4c8d-4df0-b793-8b8e06865ac7"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        },
                        "item5": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-512gb-high-visible-marks-yellow",
                            "color": "Yellow",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow11_2040x2040.jpg?alt=media&token=1d9d5e9d-3ee8-42c7-a9b8-00f8df15f483",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow22_2040x2040.png?alt=media&token=1a55190f-3fa9-4601-9cd7-39c5e1c372a1",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow33_2040x2040.png?alt=media&token=7dfdaf22-b590-4edd-a855-e08c33e2748c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow44_2040x2040.png?alt=media&token=8e442a04-b76f-4e7f-a947-9ed09625c31d"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        }
                    },
                    "combination_7": {
                        "item2": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-128gb-low-visible-marks-red",
                            "color": "Red",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red11_2040x2040.jpg?alt=media&token=e4fca45e-feeb-4af5-8d36-9ff27e8f0887",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red22_2040x2040.png?alt=media&token=8840d633-dbd2-476b-9d46-5dd23b44662c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red33_2040x2040.png?alt=media&token=7a739c85-ad14-42cb-8ac2-d67a4ef40b0a",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red441_2040x2040.jpg?alt=media&token=33b84d5d-687a-4902-940e-9985c0d9d633"
                            ],
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        },
                        "item1": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-128gb-low-visible-marks-midnight",
                            "color": "Midnight",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight11_2040x2040.jpg?alt=media&token=96844a23-c0c5-4450-a553-2309ac62d58e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight22_2040x2040.png?alt=media&token=57349c4a-56ad-42f3-9a44-212111ad95ca",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight33_2040x2040.png?alt=media&token=50b4cf56-0ad7-44b2-bbce-80a81b635471",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight441_2040x2040.jpg?alt=media&token=d4de15d1-f7ad-4d34-8b9a-a027d2bd60f8"
                            ],
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        },
                        "item4": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-128gb-low-visible-marks-starlight",
                            "color": "Starlight",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight11_2040x2040.jpg?alt=media&token=a0b26e54-8f07-4993-9471-0d76a13d2881",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight22_2040x2040.png?alt=media&token=65bb35df-16e7-4a78-b475-0927a3529732",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight33_2040x2040.png?alt=media&token=7f19db0f-b50e-4c08-8ff4-d755505534bc",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight441_2040x2040.jpg?alt=media&token=54f5e13e-b750-4615-b3a8-c592e0609003"
                            ],
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        },
                        "item3": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-128gb-low-visible-marks-blue",
                            "color": "Blue",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue11_2040x2040.jpg?alt=media&token=fd10f5f0-5e0f-469f-89a9-1ad3aad37b05",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%2022_2040x2040.png?alt=media&token=fdc7184f-7e02-481e-b18d-8983e769fc11",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue33_2040x2040.png?alt=media&token=76a879ea-d545-4c3b-8a01-6cc0e99ad979",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%20441_2040x2040.jpg?alt=media&token=747b6d6c-e0c4-4272-b391-272b4508b1bf"
                            ],
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        },
                        "item6": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-128gb-low-visible-marks-purple",
                            "color": "Purple",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple11_2040x2040.jpg?alt=media&token=195288af-7e2c-49ae-b664-82b669b61842",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple22_2040x2040.png?alt=media&token=a7668787-e9a7-437c-8499-839291c4066e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple33_2040x2040.png?alt=media&token=79438986-eb39-45e6-9450-cb6e2473c647",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple%20441_2040x2040.jpg?alt=media&token=29b13e09-4c8d-4df0-b793-8b8e06865ac7"
                            ],
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        },
                        "item5": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-128gb-low-visible-marks-yellow",
                            "color": "Yellow",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow11_2040x2040.jpg?alt=media&token=1d9d5e9d-3ee8-42c7-a9b8-00f8df15f483",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow22_2040x2040.png?alt=media&token=1a55190f-3fa9-4601-9cd7-39c5e1c372a1",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow33_2040x2040.png?alt=media&token=7dfdaf22-b590-4edd-a855-e08c33e2748c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow44_2040x2040.png?alt=media&token=8e442a04-b76f-4e7f-a947-9ed09625c31d"
                            ],
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        }
                    },
                    "combination_12": {
                        "item2": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-512gb-low-no-visible-marks-red",
                            "color": "Red",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red11_2040x2040.jpg?alt=media&token=e4fca45e-feeb-4af5-8d36-9ff27e8f0887",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red22_2040x2040.png?alt=media&token=8840d633-dbd2-476b-9d46-5dd23b44662c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red33_2040x2040.png?alt=media&token=7a739c85-ad14-42cb-8ac2-d67a4ef40b0a",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red441_2040x2040.jpg?alt=media&token=33b84d5d-687a-4902-940e-9985c0d9d633"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        },
                        "item1": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-512gb-low-no-visible-marks-midnight",
                            "color": "Midnight",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight11_2040x2040.jpg?alt=media&token=96844a23-c0c5-4450-a553-2309ac62d58e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight22_2040x2040.png?alt=media&token=57349c4a-56ad-42f3-9a44-212111ad95ca",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight33_2040x2040.png?alt=media&token=50b4cf56-0ad7-44b2-bbce-80a81b635471",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight441_2040x2040.jpg?alt=media&token=d4de15d1-f7ad-4d34-8b9a-a027d2bd60f8"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        },
                        "item4": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-512gb-low-no-visible-marks-starlight",
                            "color": "Starlight",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight11_2040x2040.jpg?alt=media&token=a0b26e54-8f07-4993-9471-0d76a13d2881",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight22_2040x2040.png?alt=media&token=65bb35df-16e7-4a78-b475-0927a3529732",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight33_2040x2040.png?alt=media&token=7f19db0f-b50e-4c08-8ff4-d755505534bc",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight441_2040x2040.jpg?alt=media&token=54f5e13e-b750-4615-b3a8-c592e0609003"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        },
                        "item3": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-512gb-low-no-visible-marks-blue",
                            "color": "Blue",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue11_2040x2040.jpg?alt=media&token=fd10f5f0-5e0f-469f-89a9-1ad3aad37b05",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%2022_2040x2040.png?alt=media&token=fdc7184f-7e02-481e-b18d-8983e769fc11",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue33_2040x2040.png?alt=media&token=76a879ea-d545-4c3b-8a01-6cc0e99ad979",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%20441_2040x2040.jpg?alt=media&token=747b6d6c-e0c4-4272-b391-272b4508b1bf"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        },
                        "item6": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-512gb-low-no-visible-marks-purple",
                            "color": "Purple",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple11_2040x2040.jpg?alt=media&token=195288af-7e2c-49ae-b664-82b669b61842",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple22_2040x2040.png?alt=media&token=a7668787-e9a7-437c-8499-839291c4066e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple33_2040x2040.png?alt=media&token=79438986-eb39-45e6-9450-cb6e2473c647",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple%20441_2040x2040.jpg?alt=media&token=29b13e09-4c8d-4df0-b793-8b8e06865ac7"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        },
                        "item5": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-512gb-low-no-visible-marks-yellow",
                            "color": "Yellow",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow11_2040x2040.jpg?alt=media&token=1d9d5e9d-3ee8-42c7-a9b8-00f8df15f483",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow22_2040x2040.png?alt=media&token=1a55190f-3fa9-4601-9cd7-39c5e1c372a1",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow33_2040x2040.png?alt=media&token=7dfdaf22-b590-4edd-a855-e08c33e2748c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow44_2040x2040.png?alt=media&token=8e442a04-b76f-4e7f-a947-9ed09625c31d"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        }
                    },
                    "combination_11": {
                        "item2": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-256gb-low-no-visible-marks-red",
                            "color": "Red",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red11_2040x2040.jpg?alt=media&token=e4fca45e-feeb-4af5-8d36-9ff27e8f0887",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red22_2040x2040.png?alt=media&token=8840d633-dbd2-476b-9d46-5dd23b44662c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red33_2040x2040.png?alt=media&token=7a739c85-ad14-42cb-8ac2-d67a4ef40b0a",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red441_2040x2040.jpg?alt=media&token=33b84d5d-687a-4902-940e-9985c0d9d633"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        },
                        "item1": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-256gb-low-no-visible-marks-midnight",
                            "color": "Midnight",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight11_2040x2040.jpg?alt=media&token=96844a23-c0c5-4450-a553-2309ac62d58e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight22_2040x2040.png?alt=media&token=57349c4a-56ad-42f3-9a44-212111ad95ca",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight33_2040x2040.png?alt=media&token=50b4cf56-0ad7-44b2-bbce-80a81b635471",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight441_2040x2040.jpg?alt=media&token=d4de15d1-f7ad-4d34-8b9a-a027d2bd60f8"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        },
                        "item4": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-256gb-low-no-visible-marks-starlight",
                            "color": "Starlight",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight11_2040x2040.jpg?alt=media&token=a0b26e54-8f07-4993-9471-0d76a13d2881",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight22_2040x2040.png?alt=media&token=65bb35df-16e7-4a78-b475-0927a3529732",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight33_2040x2040.png?alt=media&token=7f19db0f-b50e-4c08-8ff4-d755505534bc",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight441_2040x2040.jpg?alt=media&token=54f5e13e-b750-4615-b3a8-c592e0609003"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        },
                        "item3": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-256gb-low-no-visible-marks-blue",
                            "color": "Blue",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue11_2040x2040.jpg?alt=media&token=fd10f5f0-5e0f-469f-89a9-1ad3aad37b05",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%2022_2040x2040.png?alt=media&token=fdc7184f-7e02-481e-b18d-8983e769fc11",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue33_2040x2040.png?alt=media&token=76a879ea-d545-4c3b-8a01-6cc0e99ad979",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%20441_2040x2040.jpg?alt=media&token=747b6d6c-e0c4-4272-b391-272b4508b1bf"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        },
                        "item6": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-256gb-low-no-visible-marks-purple",
                            "color": "Purple",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple11_2040x2040.jpg?alt=media&token=195288af-7e2c-49ae-b664-82b669b61842",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple22_2040x2040.png?alt=media&token=a7668787-e9a7-437c-8499-839291c4066e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple33_2040x2040.png?alt=media&token=79438986-eb39-45e6-9450-cb6e2473c647",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple%20441_2040x2040.jpg?alt=media&token=29b13e09-4c8d-4df0-b793-8b8e06865ac7"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        },
                        "item5": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "80%-89%",
                            "sku": "iphone-14-256gb-low-no-visible-marks-yellow",
                            "color": "Yellow",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow11_2040x2040.jpg?alt=media&token=1d9d5e9d-3ee8-42c7-a9b8-00f8df15f483",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow22_2040x2040.png?alt=media&token=1a55190f-3fa9-4601-9cd7-39c5e1c372a1",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow33_2040x2040.png?alt=media&token=7dfdaf22-b590-4edd-a855-e08c33e2748c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow44_2040x2040.png?alt=media&token=8e442a04-b76f-4e7f-a947-9ed09625c31d"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        }
                    },
                    "combination_1": {
                        "item2": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "sku": "iphone-14-128gb-high-no-visible-marks-red",
                            "color": "Red",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red11_2040x2040.jpg?alt=media&token=e4fca45e-feeb-4af5-8d36-9ff27e8f0887",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red22_2040x2040.png?alt=media&token=8840d633-dbd2-476b-9d46-5dd23b44662c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red33_2040x2040.png?alt=media&token=7a739c85-ad14-42cb-8ac2-d67a4ef40b0a",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red441_2040x2040.jpg?alt=media&token=33b84d5d-687a-4902-940e-9985c0d9d633"
                            ],
                            "battery_health": "90%-100%",
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        },
                        "item6": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "sku": "iphone-14-128gb-high-no-visible-marks-purple",
                            "color": "Purple",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple11_2040x2040.jpg?alt=media&token=195288af-7e2c-49ae-b664-82b669b61842",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple22_2040x2040.png?alt=media&token=a7668787-e9a7-437c-8499-839291c4066e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple33_2040x2040.png?alt=media&token=79438986-eb39-45e6-9450-cb6e2473c647",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple%20441_2040x2040.jpg?alt=media&token=29b13e09-4c8d-4df0-b793-8b8e06865ac7"
                            ],
                            "battery_health": "90%-100%",
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        },
                        "item5": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "sku": "iphone-14-128gb-high-no-visible-marks-yellow",
                            "color": "Yellow",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow11_2040x2040.jpg?alt=media&token=1d9d5e9d-3ee8-42c7-a9b8-00f8df15f483",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow22_2040x2040.png?alt=media&token=1a55190f-3fa9-4601-9cd7-39c5e1c372a1",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow33_2040x2040.png?alt=media&token=7dfdaf22-b590-4edd-a855-e08c33e2748c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow44_2040x2040.png?alt=media&token=8e442a04-b76f-4e7f-a947-9ed09625c31d"
                            ],
                            "battery_health": "90%-100%",
                            "mrp": 54900,
                            "storage": "6/128",
                            "oneDayDelivery": true
                        },
                        "item1": {
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "sku": "iphone-14-128gb-high-no-visible-marks-midnight",
                            "color": "Midnight",
                            "sell": false,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight11_2040x2040.jpg?alt=media&token=96844a23-c0c5-4450-a553-2309ac62d58e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight22_2040x2040.png?alt=media&token=57349c4a-56ad-42f3-9a44-212111ad95ca",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight33_2040x2040.png?alt=media&token=50b4cf56-0ad7-44b2-bbce-80a81b635471",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight441_2040x2040.jpg?alt=media&token=d4de15d1-f7ad-4d34-8b9a-a027d2bd60f8"
                            ],
                            "battery_health": "90%-100%",
                            "price": 33899,
                            "mrp": 54900,
                            "storage": "6/128",
                            "stocks": 0,
                            "oneDayDelivery": true
                        },
                        "item4": {
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "sku": "iphone-14-128gb-high-no-visible-marks-starlight",
                            "color": "Starlight",
                            "sell": false,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight11_2040x2040.jpg?alt=media&token=a0b26e54-8f07-4993-9471-0d76a13d2881",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight22_2040x2040.png?alt=media&token=65bb35df-16e7-4a78-b475-0927a3529732",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight33_2040x2040.png?alt=media&token=7f19db0f-b50e-4c08-8ff4-d755505534bc",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight441_2040x2040.jpg?alt=media&token=54f5e13e-b750-4615-b3a8-c592e0609003"
                            ],
                            "battery_health": "90%-100%",
                            "price": 33899,
                            "mrp": 54900,
                            "storage": "6/128",
                            "stocks": 0,
                            "oneDayDelivery": true
                        },
                        "item3": {
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "sku": "iphone-14-128gb-high-no-visible-marks-blue",
                            "color": "Blue",
                            "sell": false,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue11_2040x2040.jpg?alt=media&token=fd10f5f0-5e0f-469f-89a9-1ad3aad37b05",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%2022_2040x2040.png?alt=media&token=fdc7184f-7e02-481e-b18d-8983e769fc11",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue33_2040x2040.png?alt=media&token=76a879ea-d545-4c3b-8a01-6cc0e99ad979",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%20441_2040x2040.jpg?alt=media&token=747b6d6c-e0c4-4272-b391-272b4508b1bf"
                            ],
                            "battery_health": "90%-100%",
                            "price": 33899,
                            "mrp": 54900,
                            "storage": "6/128",
                            "stocks": 0,
                            "oneDayDelivery": true
                        }
                    },
                    "combination_2": {
                        "item2": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-256gb-high-no-visible-marks-red",
                            "color": "Red",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red11_2040x2040.jpg?alt=media&token=e4fca45e-feeb-4af5-8d36-9ff27e8f0887",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red22_2040x2040.png?alt=media&token=8840d633-dbd2-476b-9d46-5dd23b44662c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red33_2040x2040.png?alt=media&token=7a739c85-ad14-42cb-8ac2-d67a4ef40b0a",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red441_2040x2040.jpg?alt=media&token=33b84d5d-687a-4902-940e-9985c0d9d633"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        },
                        "item6": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-256gb-high-no-visible-marks-purple",
                            "color": "Purple",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple11_2040x2040.jpg?alt=media&token=195288af-7e2c-49ae-b664-82b669b61842",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple22_2040x2040.png?alt=media&token=a7668787-e9a7-437c-8499-839291c4066e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple33_2040x2040.png?alt=media&token=79438986-eb39-45e6-9450-cb6e2473c647",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple%20441_2040x2040.jpg?alt=media&token=29b13e09-4c8d-4df0-b793-8b8e06865ac7"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        },
                        "item5": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-256gb-high-no-visible-marks-yellow",
                            "color": "Yellow",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow11_2040x2040.jpg?alt=media&token=1d9d5e9d-3ee8-42c7-a9b8-00f8df15f483",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow22_2040x2040.png?alt=media&token=1a55190f-3fa9-4601-9cd7-39c5e1c372a1",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow33_2040x2040.png?alt=media&token=7dfdaf22-b590-4edd-a855-e08c33e2748c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow44_2040x2040.png?alt=media&token=8e442a04-b76f-4e7f-a947-9ed09625c31d"
                            ],
                            "mrp": 64900,
                            "storage": "6/256",
                            "oneDayDelivery": true
                        },
                        "item1": {
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-256gb-high-no-visible-marks-midnight",
                            "color": "Midnight",
                            "sell": false,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight11_2040x2040.jpg?alt=media&token=96844a23-c0c5-4450-a553-2309ac62d58e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight22_2040x2040.png?alt=media&token=57349c4a-56ad-42f3-9a44-212111ad95ca",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight33_2040x2040.png?alt=media&token=50b4cf56-0ad7-44b2-bbce-80a81b635471",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight441_2040x2040.jpg?alt=media&token=d4de15d1-f7ad-4d34-8b9a-a027d2bd60f8"
                            ],
                            "price": 36999,
                            "mrp": 64900,
                            "storage": "6/256",
                            "stocks": 0,
                            "oneDayDelivery": true
                        },
                        "item4": {
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-256gb-high-no-visible-marks-starlight",
                            "color": "Starlight",
                            "sell": false,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight11_2040x2040.jpg?alt=media&token=a0b26e54-8f07-4993-9471-0d76a13d2881",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight22_2040x2040.png?alt=media&token=65bb35df-16e7-4a78-b475-0927a3529732",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight33_2040x2040.png?alt=media&token=7f19db0f-b50e-4c08-8ff4-d755505534bc",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight441_2040x2040.jpg?alt=media&token=54f5e13e-b750-4615-b3a8-c592e0609003"
                            ],
                            "price": 36999,
                            "mrp": 64900,
                            "storage": "6/256",
                            "stocks": 0,
                            "oneDayDelivery": true
                        },
                        "item3": {
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-256gb-high-no-visible-marks-blue",
                            "color": "Blue",
                            "sell": false,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue11_2040x2040.jpg?alt=media&token=fd10f5f0-5e0f-469f-89a9-1ad3aad37b05",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%2022_2040x2040.png?alt=media&token=fdc7184f-7e02-481e-b18d-8983e769fc11",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue33_2040x2040.png?alt=media&token=76a879ea-d545-4c3b-8a01-6cc0e99ad979",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%20441_2040x2040.jpg?alt=media&token=747b6d6c-e0c4-4272-b391-272b4508b1bf"
                            ],
                            "price": 36999,
                            "mrp": 64900,
                            "storage": "6/256",
                            "stocks": 0,
                            "oneDayDelivery": true
                        }
                    },
                    "combination_3": {
                        "item2": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-512gb-high-no-visible-marks-red",
                            "color": "Red",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red11_2040x2040.jpg?alt=media&token=e4fca45e-feeb-4af5-8d36-9ff27e8f0887",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red22_2040x2040.png?alt=media&token=8840d633-dbd2-476b-9d46-5dd23b44662c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red33_2040x2040.png?alt=media&token=7a739c85-ad14-42cb-8ac2-d67a4ef40b0a",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20red441_2040x2040.jpg?alt=media&token=33b84d5d-687a-4902-940e-9985c0d9d633"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        },
                        "item6": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-512gb-high-no-visible-marks-purple",
                            "color": "Purple",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple11_2040x2040.jpg?alt=media&token=195288af-7e2c-49ae-b664-82b669b61842",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple22_2040x2040.png?alt=media&token=a7668787-e9a7-437c-8499-839291c4066e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple33_2040x2040.png?alt=media&token=79438986-eb39-45e6-9450-cb6e2473c647",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20purple%20441_2040x2040.jpg?alt=media&token=29b13e09-4c8d-4df0-b793-8b8e06865ac7"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        },
                        "item5": {
                            "price": 49999,
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-512gb-high-no-visible-marks-yellow",
                            "color": "Yellow",
                            "sell": false,
                            "stocks": 0,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow11_2040x2040.jpg?alt=media&token=1d9d5e9d-3ee8-42c7-a9b8-00f8df15f483",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow22_2040x2040.png?alt=media&token=1a55190f-3fa9-4601-9cd7-39c5e1c372a1",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow33_2040x2040.png?alt=media&token=7dfdaf22-b590-4edd-a855-e08c33e2748c",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20yellow44_2040x2040.png?alt=media&token=8e442a04-b76f-4e7f-a947-9ed09625c31d"
                            ],
                            "mrp": 89900,
                            "storage": "6/512",
                            "oneDayDelivery": true
                        },
                        "item1": {
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-512gb-high-no-visible-marks-midnight",
                            "color": "Midnight",
                            "sell": false,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight11_2040x2040.jpg?alt=media&token=96844a23-c0c5-4450-a553-2309ac62d58e",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight22_2040x2040.png?alt=media&token=57349c4a-56ad-42f3-9a44-212111ad95ca",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight33_2040x2040.png?alt=media&token=50b4cf56-0ad7-44b2-bbce-80a81b635471",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20midnight441_2040x2040.jpg?alt=media&token=d4de15d1-f7ad-4d34-8b9a-a027d2bd60f8"
                            ],
                            "price": 38999,
                            "mrp": 89900,
                            "storage": "6/512",
                            "stocks": 0,
                            "oneDayDelivery": true
                        },
                        "item4": {
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-512gb-high-no-visible-marks-starlight",
                            "color": "Starlight",
                            "sell": false,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight11_2040x2040.jpg?alt=media&token=a0b26e54-8f07-4993-9471-0d76a13d2881",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight22_2040x2040.png?alt=media&token=65bb35df-16e7-4a78-b475-0927a3529732",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight33_2040x2040.png?alt=media&token=7f19db0f-b50e-4c08-8ff4-d755505534bc",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20starlight441_2040x2040.jpg?alt=media&token=54f5e13e-b750-4615-b3a8-c592e0609003"
                            ],
                            "price": 38999,
                            "mrp": 89900,
                            "storage": "6/512",
                            "stocks": 0,
                            "oneDayDelivery": true
                        },
                        "item3": {
                            "sell_price": 10000,
                            "weight": 0.5,
                            "physical_condition": "Very Light Marks",
                            "battery_health": "90%-100%",
                            "sku": "iphone-14-512gb-high-no-visible-marks-blue",
                            "color": "Blue",
                            "sell": false,
                            "rating": 4.8,
                            "rating_count": 190,
                            "images": [
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue11_2040x2040.jpg?alt=media&token=fd10f5f0-5e0f-469f-89a9-1ad3aad37b05",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%2022_2040x2040.png?alt=media&token=fdc7184f-7e02-481e-b18d-8983e769fc11",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue33_2040x2040.png?alt=media&token=76a879ea-d545-4c3b-8a01-6cc0e99ad979",
                                "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FApple%20iPhone%2FiPhone%2014_%2F14%20blue%20441_2040x2040.jpg?alt=media&token=747b6d6c-e0c4-4272-b391-272b4508b1bf"
                            ],
                            "price": 38999,
                            "mrp": 89900,
                            "storage": "6/512",
                            "stocks": 0,
                            "oneDayDelivery": true
                        }
                    }
                }
            }
        },
        "id": "aJRqoPbV7y5s3AWDGGyc",
        "extra_coins": 0
    },
    "specifications": {
        "description": {
            "Connectivity": {
                "Wi-Fi": "Wi-Fi 6 (802.11ax) with 2x2 MIMO",
                "Bluetooth": "Bluetooth 5.3",
                "Cellular": "5G (sub-6 GHz), Gigabit-class LTE with 4x4 MIMO and LAA, Dual SIM (nano-SIM + eSIM)",
                "USB": "Lightning connector",
                "Other": "NFC with reader mode, Emergency SOS via satellite, Crash Detection"
            },
            "Design": {
                "Body_Type": "Smartphone",
                "Construction": "Aerospace-grade aluminum frame, Ceramic Shield front, color-infused glass back",
                "Dimensions": "146.7 mm × 71.5 mm × 7.80 mm",
                "Weight": "172 g"
            },
            "Global_Attributes": {
                "brand": "Apple",
                "genre": "Smartphone",
                "type": "iPhone",
                "platform": "iOS",
                "publisher": "Apple",
                "release_date": "September 16, 2022",
                "release_year": 2022
            },
            "Performance": {
                "Processor": "A15 Bionic chip with 6-core CPU (2 performance + 4 efficiency), 5-core GPU, 16-core Neural Engine",
                "RAM": "6GB LPDDR4X",
                "Storage": "128GB / 256GB / 512GB NVMe",
                "Display": "6.1-inch Super Retina XDR OLED, 2532 × 1170 resolution at 460 ppi, HDR, True Tone, Wide color (P3), Haptic Touch, 1200 nits peak brightness (HDR), 800 nits typical max brightness",
                "Battery": "Up to 20 hours video playback, up to 80 hours audio playback, fast-charge capable (50% in 30 minutes with 20W adapter)",
                "Camera": {
                    "Rear": "12MP Main (f/1.5, sensor-shift OIS), 12MP Ultra Wide (f/2.4, 120° FOV)",
                    "Front": "12MP TrueDepth (f/1.9) with autofocus",
                    "Video": "4K Dolby Vision HDR up to 60 fps, Cinematic mode up to 4K HDR at 30 fps, Action mode up to 2.8K at 60 fps"
                },
                "Features": "IP68 dust and water resistant (6 meters for 30 minutes), Face ID, Emergency SOS via satellite, Crash Detection, iOS 16 (upgradable)"
            },
            "summary": "The iPhone 14 features the powerful A15 Bionic chip, a 6.1-inch Super Retina XDR display, advanced dual-camera system with sensor-shift stabilization, and important safety features including Emergency SOS via satellite and Crash Detection. It delivers exceptional performance, all-day battery life, and stunning photos and videos. Buy used iPhone 14, pre-owned Apple smartphones, or second-hand mobile accessories in India."
        },
        "minimum_price": 1000,
        "updated_at": {
            "_nanoseconds": 663000000,
            "_seconds": 1771425709
        },
        "color_codes": {
            "Midnight": "#000000",
            "Starlight": "#FFFFFF"
        },
        "configuration_icons": {
            "Storage": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fstorage_icon.png?alt=media&token=06fd3c54-774f-404c-b721-219274614ceb",
            "Ram": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fram_icon.png?alt=media&token=7dae249e-1fb1-4ce2-9ce8-0fbba3ff572d",
            "Physical Condition": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fphysical_condition_icon.png?alt=media&token=1d568f91-0c48-49ff-a2c7-4c36710b3360",
            "Battery health": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fbattery_health_icon.png?alt=media&token=b26ade4a-433c-40db-9ee5-1994d81e4b3b"
        },
        "combination": {
            "combination_1": {
                "color": [
                    "Midnight",
                    "Starlight",
                    "Red",
                    "Blue",
                    "Purple",
                    "Yellow"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "battery_health": [
                    "90%-100%"
                ],
                "storage": [
                    "6/128"
                ]
            },
            "combination_10": {
                "color": [
                    "Midnight",
                    "Starlight",
                    "Red",
                    "Blue",
                    "Purple",
                    "Yellow"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "battery_health": [
                    "80%-89%"
                ],
                "storage": [
                    "6/128"
                ]
            },
            "combination_11": {
                "color": [
                    "Midnight",
                    "Starlight",
                    "Red",
                    "Blue",
                    "Purple",
                    "Yellow"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "battery_health": [
                    "80%-89%"
                ],
                "storage": [
                    "6/256"
                ]
            },
            "combination_12": {
                "color": [
                    "Midnight",
                    "Starlight",
                    "Red",
                    "Blue",
                    "Purple",
                    "Yellow"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "battery_health": [
                    "80%-89%"
                ],
                "storage": [
                    "6/512"
                ]
            },
            "combination_2": {
                "color": [
                    "Midnight",
                    "Starlight",
                    "Red",
                    "Blue",
                    "Purple",
                    "Yellow"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "battery_health": [
                    "90%-100%"
                ],
                "storage": [
                    "6/256"
                ]
            },
            "combination_3": {
                "color": [
                    "Midnight",
                    "Starlight",
                    "Red",
                    "Blue",
                    "Purple",
                    "Yellow"
                ],
                "physical_condition": [
                    "Very Light Marks"
                ],
                "battery_health": [
                    "90%-100%"
                ],
                "storage": [
                    "6/512"
                ]
            },
            "combination_4": {
                "color": [
                    "Midnight",
                    "Starlight",
                    "Red",
                    "Blue",
                    "Purple",
                    "Yellow"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "battery_health": [
                    "90%-100%"
                ],
                "storage": [
                    "6/128"
                ]
            },
            "combination_5": {
                "color": [
                    "Midnight",
                    "Starlight",
                    "Red",
                    "Blue",
                    "Purple",
                    "Yellow"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "battery_health": [
                    "90%-100%"
                ],
                "storage": [
                    "6/256"
                ]
            },
            "combination_6": {
                "color": [
                    "Midnight",
                    "Starlight",
                    "Red",
                    "Blue",
                    "Purple",
                    "Yellow"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "battery_health": [
                    "90%-100%"
                ],
                "storage": [
                    "6/512"
                ]
            },
            "combination_7": {
                "color": [
                    "Midnight",
                    "Starlight",
                    "Red",
                    "Blue",
                    "Purple",
                    "Yellow"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "battery_health": [
                    "80%-89%"
                ],
                "storage": [
                    "6/128"
                ]
            },
            "combination_8": {
                "color": [
                    "Midnight",
                    "Starlight",
                    "Red",
                    "Blue",
                    "Purple",
                    "Yellow"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "battery_health": [
                    "80%-89%"
                ],
                "storage": [
                    "6/256"
                ]
            },
            "combination_9": {
                "color": [
                    "Midnight",
                    "Starlight",
                    "Red",
                    "Blue",
                    "Purple",
                    "Yellow"
                ],
                "physical_condition": [
                    "Light Marks"
                ],
                "battery_health": [
                    "80%-89%"
                ],
                "storage": [
                    "6/512"
                ]
            }
        },
        "option_descriptions": {
            "Visible Marks": "Visible scratches or scuffs noticeable in regular use. May have a light dent or two. Fully functional, just not pristine.",
            "No Visible Marks": "Minor surface scratches or scuffs that are only noticeable under close inspection. No dents, no deep scratches. Looks great from a normal viewing distance.",
            "Low Visible Marks": "Minor surface scratches or scuffs that are only noticeable under close inspection. No dents, no deep scratches. Looks great from a normal viewing distance.",
            "Medium Visible Marks": "Visible scratches or scuffs noticeable in regular use. May have a light dent or two. Fully functional, just not pristine.",
            "Light Visible Marks": "Minor surface scratches or scuffs that are only noticeable under close inspection. No dents, no deep scratches. Looks great from a normal viewing distance.",
            "Very Light Marks": "Looks and feels almost new. Any marks on the frame or back are so faint they're only noticeable under direct light or at very close range. Nothing you'd spot in regular use.",
            "Light Marks": "Has minor marks on the frame or back from everyday use, the kind you'd expect on a well-cared-for phone. Screen is clean or has very light marks that don't affect display quality. Looks clean from a normal distance. No dents, no deep scratches."
        },
        "questions": {
            "q1": {
                "deduction": 0,
                "description": "",
                "isRequired": true,
                "options": [
                    "Yes",
                    "No"
                ],
                "question": "Does the iPhone power on and boot to iOS without issues?",
                "type": "radio"
            },
            "q2": {
                "deduction": 0,
                "description": "",
                "isRequired": true,
                "options": [
                    "Yes",
                    "No"
                ],
                "question": "Are there any performance, battery, display, camera, or Face ID issues?",
                "type": "radio"
            },
            "q3": {
                "description": "Please choose the accessories missing",
                "isRequired": false,
                "options": [
                    {
                        "deduction": 2500,
                        "icon": "Icons.charger",
                        "label": "Original 20W USB-C Power Adapter Missing"
                    },
                    {
                        "deduction": 800,
                        "icon": "Icons.cable",
                        "label": "USB-C to Lightning Cable Missing"
                    }
                ],
                "question": "Accessories Missing",
                "type": "checkbox"
            }
        }
    }
  },
  TXTnJ4HuCt2bG4oNe8cZ:{
     "details": {
        "category_name": "Cameras",
        "spec_id": "nikon-d3100",
        "yt_iframe": "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/BQSartDmdGg?si=uqKo6qg9jRPHWPPZ\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
        "created_at": {
            "_seconds": 1755520130,
            "_nanoseconds": 814000000
        },
        "sell_max_price": 7800,
        "code": "D014Y",
        "mrp": 27999,
        "condition": "Pre Owned",
        "add_ons": {
            "item1": {
                "id": "JbnNS6lJSsUWHAougdva",
                "sku": "nikon-af-p-dx-nikkor-70-300-black"
            },
            "item2": {
                "id": "KjbAaJFC5uczlpKB45hh",
                "sku": "nikon-55-200-mm-black"
            },
            "item3": {
                "id": "YFx22gVDvnaHXaeOLb4N",
                "sku": "nikon-af-s-dx-18-105-mm-black"
            },
            "item4": {
                "id": "zDW8I9PcNWdDjFsCyHwh",
                "sku": "nikon-af-70-300-mm-black"
            }
        },
        "rating": 4.3,
        "rating_count": 77,
        "product_title": "Nikon D3100 DSLR Camera With 18-55mm Kit Lens",
        "brand": "Nikon",
        "type": "DSLR",
        "in_stock": true,
        "price": 15999,
        "sell": false,
        "vendors": {
            "VENDOR_001": {
                "name": "Dacby Technologies Pvt. Ltd.",
                "ratings": 4.7,
                "total_sales": 320,
                "vendor_id": "yyyyyyyyyyyyyyyyyyyyyyyyyyyy",
                "vendor_note": "",
                "combination_offered": {
                    "combination_1": {
                        "item1": {
                            "images": [
                                "https://dacby-database.web.app/cdn/11%2Fps4%20cd%2F1%20CAMERAS%2FNIKON%203100D%2Fa4d9a53f-bd16-4ad2-9994-84688bc52f3a_2040x2040.png?alt=media&token=7d93e731-3ccf-4be5-afa8-378286945c98",
                                "https://dacby-database.web.app/cdn/11%2Fps4%20cd%2F1%20CAMERAS%2FNIKON%203100D%2Fb1b55b4c-a6af-4239-a00a-28b84aceb9c9_2040x2040.png?alt=media&token=374afb9c-f204-486e-9ebb-5d883758e2dd",
                                "https://dacby-database.web.app/cdn/11%2Fps4%20cd%2F1%20CAMERAS%2FNIKON%203100D%2Ff44f79f6-1712-4057-9a8f-1e7311d1904a_2040x2040.png?alt=media&token=2180cb3c-f22b-44ed-b906-fa8b9d7508df",
                                "https://dacby-database.web.app/cdn/11%2Fps4%20cd%2F1%20CAMERAS%2FNIKON%203100D%2F7a9e7cac-6a0f-486e-b1e1-62fb94330d4c_2040x2040.png?alt=media&token=8bacc8c2-665c-4abf-8164-83161db25c9d"
                            ],
                            "mrp": 27999,
                            "color": "Black",
                            "sell_price": 7800,
                            "price": 15999,
                            "weight": 4,
                            "sell": false,
                            "shutter_count": "Less Than 10K",
                            "sku": "nikon-d3100-with-18-55-mm-black-low",
                            "rating": 4.1,
                            "rating_count": 89,
                            "stocks": 0,
                            "accessories": {
                                "item1": {
                                    "id": "Uqw1bzvfBie0G5xRgmin",
                                    "sku": "nikon-18-55mm-afs-dx-vr"
                                }
                            },
                            "oneDayDelivery": true
                        },
                        "item3": {
                            "images": [
                                "https://dacby-database.web.app/cdn/11%2Fps4%20cd%2F1%20CAMERAS%2FNIKON%203100D%2Fa4d9a53f-bd16-4ad2-9994-84688bc52f3a_2040x2040.png?alt=media&token=7d93e731-3ccf-4be5-afa8-378286945c98",
                                "https://dacby-database.web.app/cdn/11%2Fps4%20cd%2F1%20CAMERAS%2FNIKON%203100D%2Fb1b55b4c-a6af-4239-a00a-28b84aceb9c9_2040x2040.png?alt=media&token=374afb9c-f204-486e-9ebb-5d883758e2dd",
                                "https://dacby-database.web.app/cdn/11%2Fps4%20cd%2F1%20CAMERAS%2FNIKON%203100D%2Ff44f79f6-1712-4057-9a8f-1e7311d1904a_2040x2040.png?alt=media&token=2180cb3c-f22b-44ed-b906-fa8b9d7508df",
                                "https://dacby-database.web.app/cdn/11%2Fps4%20cd%2F1%20CAMERAS%2FNIKON%203100D%2F7a9e7cac-6a0f-486e-b1e1-62fb94330d4c_2040x2040.png?alt=media&token=8bacc8c2-665c-4abf-8164-83161db25c9d"
                            ],
                            "mrp": 27999,
                            "color": "Black",
                            "sell_price": 5800,
                            "weight": 4,
                            "sell": false,
                            "shutter_count": "Above 1L",
                            "sku": "nikon-d3100-with-18-55-mm-black-high",
                            "rating": 4.5,
                            "rating_count": 200,
                            "price": 14999,
                            "stocks": 0,
                            "accessories": {
                                "item1": {
                                    "id": "Uqw1bzvfBie0G5xRgmin",
                                    "sku": "nikon-18-55mm-afs-dx-vr"
                                }
                            },
                            "oneDayDelivery": true
                        },
                        "item2": {
                            "images": [
                                "https://dacby-database.web.app/cdn/11%2Fps4%20cd%2F1%20CAMERAS%2FNIKON%203100D%2Fa4d9a53f-bd16-4ad2-9994-84688bc52f3a_2040x2040.png?alt=media&token=7d93e731-3ccf-4be5-afa8-378286945c98",
                                "https://dacby-database.web.app/cdn/11%2Fps4%20cd%2F1%20CAMERAS%2FNIKON%203100D%2Fb1b55b4c-a6af-4239-a00a-28b84aceb9c9_2040x2040.png?alt=media&token=374afb9c-f204-486e-9ebb-5d883758e2dd",
                                "https://dacby-database.web.app/cdn/11%2Fps4%20cd%2F1%20CAMERAS%2FNIKON%203100D%2Ff44f79f6-1712-4057-9a8f-1e7311d1904a_2040x2040.png?alt=media&token=2180cb3c-f22b-44ed-b906-fa8b9d7508df",
                                "https://dacby-database.web.app/cdn/11%2Fps4%20cd%2F1%20CAMERAS%2FNIKON%203100D%2F7a9e7cac-6a0f-486e-b1e1-62fb94330d4c_2040x2040.png?alt=media&token=8bacc8c2-665c-4abf-8164-83161db25c9d"
                            ],
                            "mrp": 27999,
                            "color": "Black",
                            "sell_price": 6800,
                            "weight": 4,
                            "sell": false,
                            "shutter_count": "10K – 1L",
                            "sku": "nikon-d3100-with-18-55-mm-black-medium",
                            "rating": 4.7,
                            "rating_count": 236,
                            "price": 15999,
                            "accessories": {
                                "item1": {
                                    "id": "Uqw1bzvfBie0G5xRgmin",
                                    "sku": "nikon-18-55mm-afs-dx-vr"
                                }
                            },
                            "stocks": 1,
                            "oneDayDelivery": true
                        }
                    }
                }
            }
        },
        "updated_at": {
            "_seconds": 1784045056,
            "_nanoseconds": 72000000
        },
        "id": "TXTnJ4HuCt2bG4oNe8cZ",
        "extra_coins": 1000
    },
    "specifications": {
        "description": {
            "Connectivity": {
                "Wi-Fi": "Not supported",
                "HDMI": "Mini HDMI (Type C)",
                "USB": "USB 2.0 (480 Mbit/sec)",
                "Remote_Control": "Wired (MC-DC2) or infrared (ML-L3)"
            },
            "Design": {
                "Body_Type": "Compact SLR",
                "Construction": "Polycarbonate",
                "Dimensions": "124.5 x 96.5 x 74.5 mm",
                "Weight": "505 g (with battery and card)"
            },
            "Global_Attributes": {
                "brand": "Nikon",
                "genre": "Camera",
                "type": "Digital SLR",
                "platform": "Nikon DX-format",
                "publisher": "Nikon",
                "release_date": "August 19, 2010",
                "release_year": 2010
            },
            "Performance": {
                "Sensor": "14.2 MP APS-C CMOS (23.1 x 15.4 mm)",
                "Processor": "EXPEED 2",
                "ISO_Range": "100-3200 (expandable to 12800)",
                "Autofocus": "11-point Multi-CAM 1000, 1 cross-type",
                "Continuous_Shooting": "3 fps",
                "Video_Resolution": "Full HD 1920x1080 (24p), HD 1280x720 (30p/25p/24p)",
                "Battery_Life": "550 shots (CIPA, viewfinder)"
            },
            "summary": "The Nikon D3100 is an entry-level APS-C DSLR camera ideal for beginners, featuring a 14.2-megapixel CMOS sensor, EXPEED 2 processor, and 11-point autofocus system. With Full HD video recording and a Guide Mode for ease of use, it’s a great choice for photography enthusiasts. Buy used cameras, pre-owned Nikon DSLRs, and second-hand photography gear in India. Sell camera equipment online and explore pre-owned Canon cameras or used photography accessories in India with this camera."
        },
        "minimum_price": 1000,
        "combination": {
            "combination_1": {
                "color": [
                    "Black"
                ],
                "shutter_count": [
                    "Less Than 10K",
                    "10K – 1L",
                    "Above 1L"
                ]
            }
        },
        "configuration_icons": {
            "Shutter Count": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fshutter_count_icon.png?alt=media&token=b9c58640-245f-47c3-ae34-3ca01b1f950c"
        },
        "whats_in_the_box": [
            {
                "image_url": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fcamera_icon.png?alt=media&token=d5d53757-d028-4a03-8cb3-57f825a43f46",
                "label": "Camera"
            },
            {
                "image_url": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fcamera_charger_icon.png?alt=media&token=d93f64ae-dd5a-4b88-a9d3-f41eeab3a4f8",
                "label": "Compatible\nCharger"
            },
            {
                "image_url": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fbattery_icon.png?alt=media&token=9812e91c-27c1-4afa-a3e7-ff10aa3296ff",
                "label": "Compatible\nBattery"
            },
            {
                "image_url": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Flens_icon.png?alt=media&token=772c74db-357b-42b5-adb2-a37c94ceec35",
                "label": "18-55mm\nLens"
            },
            {
                "image_url": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fcamera_lens_cap.png?alt=media&token=5cf82abe-acf2-48ab-80a3-571cbf2741b5",
                "label": "Lens\nCap"
            },
            {
                "image_url": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fcamera_strap_icon.png?alt=media&token=ed12a123-79cc-4cc8-beb0-7571e46a0dcb",
                "label": "Strap"
            }
        ],
        "option_descriptions": {
            "Less than 10K": "Minimal use, little to no visible wear. Feels close to an open box camera.",
            "10K – 1L": "Light to moderate use. Light visible marks may exist. Fully reliable and great value for money.",
            "Above 1L": "Used. Some visible wear may exist, but fully functional and dependable."
        },
        "questions": {
            "q1": {
                "deduction": 0,
                "description": "",
                "isRequired": true,
                "options": [
                    "Yes",
                    "No"
                ],
                "question": "Is the camera turning on without any issues?",
                "type": "radio"
            },
            "q2": {
                "deduction": 0,
                "description": "",
                "isRequired": true,
                "options": [
                    "Yes",
                    "No"
                ],
                "question": "Are there any performance or functionality issues?",
                "type": "radio"
            },
            "q3": {
                "description": "Please choose the accessories missing",
                "isRequired": false,
                "options": [
                    {
                        "deduction": 2500,
                        "icon": "Icons.disc_full",
                        "label": "Original Adapter Missing"
                    },
                    {
                        "deduction": 2500,
                        "icon": "Icons.usb",
                        "label": "Original Battery Missing"
                    }
                ],
                "question": "Accessories Missing",
                "type": "checkbox"
            }
        }
    }
  }
};