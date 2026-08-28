export function emptyItem() {
  return {
    mrp: "",
    price: "",
    sell_price: 1000,
    sku: "",
    skuManuallyEdited: false,
    stocks: "",
    weight: 0.5,
    rating: 4.5,
    rating_count: 115,
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
export const phoneOptionsDesc= {
            "No Visible Marks": "Looks almost untouched. No visible scratches, dents, or scuffs even on close inspection. Excellent cosmetic condition.",
            "Very Light Marks": "In excellent condition. Any marks on the frame or back are so faint you'd only find them under direct light while actively looking. Nothing you'd notice in regular use.\n- **Screen Glass**: 0 to 1 hairline scratch, or none at all. No cracks or damage.\n- **Display**: Bright and clear. No pressure marks, spots, or discoloration.\n- **Frame & Sides**: 0 to 3 very light hairline scratches, or none at all. No dents.\n- **Back Panel**: Clean with no visible marks from normal distance.",
            "Light Marks": "Has light signs of everyday use, the kind a careful owner leaves behind. Looks clean from normal distance. Nothing that affects how you use it.\n- **Screen Glass**: 2 to 4 light surface marks possible. No cracks or damage affecting clarity.\n- **Display**: Fully functional. Minor pressure marks may show under specific lighting but won't bother you daily.\n- **Frame & Sides**: 4 to 7 light surface scratches possible. No dents.\n- **Back Panel**: May have light marks or minor scuffs. No cracks or deep scratches.",
            "Light Visible Marks": "Minor surface scratches or scuffs that are only noticeable under close inspection. No dents, no deep scratches. Looks great from a normal viewing distance.",
            "Low Visible Marks": "Minor surface scratches or scuffs that are only noticeable under close inspection. No dents, no deep scratches. Looks great from a normal viewing distance.",
            "Medium Visible Marks": "Visible scratches, scuffs, or small dents noticeable during regular use. Device remains fully functional but shows moderate cosmetic wear.",
            "Visible Marks": "Visible scratches or scuffs noticeable in regular use. May have a light dent or two. Fully functional, just not pristine."
        }
    export const laptopOptionsDesc = {
            "Visible Marks": "Visible scratches or scuffs noticeable in regular use. May have a light dent or two. Fully functional, just not pristine.",
            "No Visible Marks": "Minor surface scratches or scuffs that are only noticeable under close inspection. No dents, no deep scratches. Looks great from a normal viewing distance.",
            "Low Visible Marks": "Minor surface scratches or scuffs that are only noticeable under close inspection. No dents, no deep scratches. Looks great from a normal viewing distance.",
            "Medium Visible Marks": "Visible scratches or scuffs noticeable in regular use. May have a light dent or two. Fully functional, just not pristine.",
            "Light Visible Marks": "Minor surface scratches or scuffs that are only noticeable under close inspection. No dents, no deep scratches. Looks great from a normal viewing distance.",
            "Very Light Marks": "In excellent condition. Any marks are so faint you'd only find them by tilting the laptop under direct light and actively looking. Nothing you'd notice in regular use.\n- **Screen**: 0 to 1 hairline scratch, or none at all. No cracks or damage.\n- **Display**: Bright and clear. No pressure marks, spots, or discoloration.\n- **Keyboard & Palm Rest**: Clean with no key shine or wear.\n- **Body**: 0 to 3 very light hairline scratches, or none at all. No dents.",
            "Light Marks": "Has light signs of everyday use, the kind a careful owner leaves behind. Looks clean from normal distance. Nothing that affects how you use it.\n- **Screen Glass**: 2 to 4 light surface marks possible. No cracks or damage affecting clarity.\n- **Display**: Fully functional. Minor pressure marks may show under specific lighting but won't bother you daily.\n- **Frame & Sides**: 4 to 7 light surface scratches possible. No dents.\n- **Back Panel**: May have light marks or minor scuffs. No cracks or deep scratches."
        }
    export const configurationIcons = {
      "Storage": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fstorage_icon.png?alt=media&token=06fd3c54-774f-404c-b721-219274614ceb",
      "Ram": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fram_icon.png?alt=media&token=7dae249e-1fb1-4ce2-9ce8-0fbba3ff572d",
      "Physical Condition": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fphysical_condition_icon.png?alt=media&token=1d568f91-0c48-49ff-a2c7-4c36710b3360",
      "Battery health": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fbattery_health_icon.png?alt=media&token=b26ade4a-433c-40db-9ee5-1994d81e4b3b"
    }
    export const cameraConfigurationIcons = {
            "Shutter Count": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fshutter_count_icon.png?alt=media&token=b9c58640-245f-47c3-ae34-3ca01b1f950c"
        }
    export const androidQuestions = {
      "q1": {
        "isRequired": true,
        "question": "Does the phone power on and boot to Android without issues?",
        "type": "radio",
        "deduction": 0,
        "description": "",
        "options": [
          "Yes",
          "No"
        ]
      },
      "q2": {
        "options": [
          "Yes",
          "No"
        ],
        "description": "",
        "deduction": 0,
        "type": "radio",
        "isRequired": true,
        "question": "Are there any performance, display, camera, fingerprint sensor, speaker, charging, or network issues?"
      },
      "q3": {
        "description": "Please choose the accessories missing",
        "options": [
          {
            "icon": "Icons.cable",
            "deduction": 800,
            "label": "USB-C Cable Missing"
          }
        ],
        "isRequired": false,
        "question": "Accessories Missing",
        "type": "checkbox"
      }
    }
  //  export const iphoneQuestions = {
  //           "Shutter Count": "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2FIcons%2Fshutter_count_icon.png?alt=media&token=b9c58640-245f-47c3-ae34-3ca01b1f950c"
  //       }