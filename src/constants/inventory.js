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
  }
};