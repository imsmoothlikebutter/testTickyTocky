import * as dotenv from "dotenv";
dotenv.config();

// Environment variables
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;

// Server
export const PORT = 3001;
export const MONGODB_CONNECTION = `mongodb+srv://${DB_USER}:${DB_PASS}@testingauctionsystem.5zpmbym.mongodb.net/testingauctionsystem?retryWrites=true&w=majority`;

// Error message
export const INTERNAL_SERVER_ERROR = "Internal Server Error";

// Email variables
export const EMAIL_NAME = process.env.EMAIL_NAME;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;

// Secrets
export const SECRET = process.env.SECRET;
export const CRYPTOSECRET = process.env.CRYPTOSECRET;

// WATCH BRANDS
export const WATCH_BRANDS = [
    "Rolex",
    "Omega",
    "Patek Philippe",
    "Audemars Piguet",
    "Tag Heuer",
    "Seiko",
    "Citizen",
    "Casio",
    "Timex",
    "Longines",
    "Tissot",
    "Swatch",
    "Fossil",
    "Bulova",
    "Panerai",
    "IWC Schaffhausen",
    "Jaeger-LeCoultre",
    "Hublot",
    "Breitling",
    "Zenith",
    "Cartier",
    "Vacheron Constantin",
    "Montblanc",
    "Blancpain",
    "Chopard",
    "Hamilton",
    "Oris",
    "Rado",
    "Franck Muller",
    "Bell & Ross",
    "Ulysse Nardin",
    "Girard-Perregaux",
    "Movado",
    "Raymond Weil",
    "Sinn",
    "Nomos Glashütte",
    "Alpina",
    "Mido",
    "Hermès",
    "Breguet",
    "U-Boat",
    "G-Shock",
    "Grand Seiko",
    "Junghans",
    "Shinola",
    "MeisterSinger",
    "Citizen Eco-Drive",
    "Ebel",
];

// WATCH MOVEMENTS
export const WATCH_MOVEMENTS = [
    "Automatic (Self-Winding)",
    "Quartz",
    "Manual (Hand-Winding)",
    "Kinetic",
    "Solar-Powered",
    "Turbillon",
    "Chronograph",
    "Mechanical",
    "Spring Drive",
    "Co-Axial",
    "Swiss Lever Escapement",
    "Digital",
    "Automatic Chronometer",
    "Tourbillon",
    "Skeleton",
    "Moon Phase",
    "Perpetual Calendar",
    "Split-Second Chronograph",
    "Quartz Chronometer",
    "Spring-Loaded Gear Train",
    "Mechanical Digital",
    "Automatic Tourbillon",
    "Automatic Moon Phase",
    "Quartz Perpetual Calendar",
    "Quartz Moon Phase",
    "Electronic",
    "Metronome",
    "Fusee and Chain",
    "Centripetal Escapement",
    "Repeater",
    "Tourbillon Carrousel",
];

export const WATCH_CASE_MATERIALS = [
    "Stainless Steel",
    "Titanium",
    "Gold (Yellow, Rose, White)",
    "Platinum",
    "Ceramic",
    "Aluminum",
    "Carbon Fiber",
    "Bronze",
    "PVD Coating",
    "Tungsten",
    "Silver",
    "Brass",
    "Resin",
    "Composite",
    "Plastic",
    "Wood",
    "Diamond",
    "Sapphire Crystal",
    "Copper",
    "Nickel",
    "Chrome",
    "Palladium",
    "Carbon Composite",
    "Fiberglass",
    "Rubber",
    "Mother of Pearl",
    "Palladium-Platinum Alloy",
    "Silicon",
    "Alloy",
    "Stainless Steel with DLC Coating",
    "Gold-Plated",
    "Surgical Grade Stainless Steel",
];

// WATCH BRACELET STRAP MATERIALS
export const BRACELET_STRAP_MATERIALS = [
    "Stainless Steel",
    "Leather",
    "Rubber",
    "NATO Strap",
    "Silicone",
    "Canvas",
    "Textile",
    "Mesh",
    "Metal Bracelet",
    "Ceramic",
    "Alligator Leather",
    "Crocodile Leather",
    "Suede",
    "Titanium",
    "Rubber with Textile",
    "Rubber with Leather",
    "Synthetic",
    "Polyurethane",
    "Paracord",
    "Velcro",
    "Cordura",
    "Rubber with Metal",
    "Denim",
    "Felt",
    "Nylon",
    "Resin",
    "Chain Link",
    "Fabric",
    "Kevlar",
    "Exotic Skin",
    "Polymer",
    "Wood",
];

// GENDER
export const GENDER = [
    "Male",
    "Female",
];
