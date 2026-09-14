export const PAKISTANI_CITIES = [
  "Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Gujranwala", "Peshawar",
  "Multan", "Hyderabad", "Islamabad", "Quetta", "Bahawalpur", "Sargodha",
  "Sialkot", "Sukkur", "Larkana", "Sheikhupura", "Rahim Yar Khan", "Jhang",
  "Dera Ghazi Khan", "Gujrat", "Sahiwal", "Wah Cantonment", "Mardan",
  "Kasur", "Okara", "Mingora", "Nawabshah", "Chiniot", "Kotri", "Kamoke",
  "Hafizabad", "Sadiqabad", "Mirpur Khas", "Burewala", "Kohat", "Khanewal",
  "Dera Ismail Khan", "Turbat", "Muzaffargarh", "Abbottabad", "Mandi Bahauddin",
  "Shikarpur", "Jacobabad", "Jhelum", "Khanpur", "Khairpur", "Khuzdar",
  "Pakpattan", "Hub", "Gojra", "Daska", "Chakwal", "Bahawalnagar", "Muzaffarabad", "Mirpur (AJK)"
];

export const PAKISTAN_CITIES = PAKISTANI_CITIES.map(name => {
  let province = "Punjab";
  if (["Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah", "Kotri", "Mirpur Khas", "Shikarpur", "Jacobabad", "Khairpur"].includes(name)) province = "Sindh";
  else if (["Peshawar", "Mardan", "Mingora", "Kohat", "Dera Ismail Khan", "Abbottabad"].includes(name)) province = "KPK";
  else if (["Quetta", "Turbat", "Khuzdar", "Hub"].includes(name)) province = "Balochistan";
  else if (name === "Islamabad") province = "Islamabad Capital";
  else if (name.includes("AJK") || name === "Muzaffarabad") province = "Azad Kashmir";
  return { name, province };
});

export const PAKISTANI_PROVINCES = [
  "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory", "Azad Kashmir", "Gilgit-Baltistan"
];

export const COURIER_PARTNERS = [
  { id: "tcs", name: "TCS Express", urlTemplate: "https://www.tcsexpress.com/tracking?track={tracking}" },
  { id: "leopards", name: "Leopards Courier", urlTemplate: "https://www.leopardscourier.com/tracking?track={tracking}" },
  { id: "trax", name: "Trax Logistics", urlTemplate: "https://trax.pk/tracking?tracking_number={tracking}" },
  { id: "callcourier", name: "CallCourier", urlTemplate: "https://callcourier.com.pk/tracking/?tc={tracking}" },
  { id: "mnp", name: "M&P Express", urlTemplate: "https://multiplex.net.pk/tracking?consignment={tracking}" }
];
