// CLIENT URL
export const HOME_URL = "/";
export const ABOUT_US_URL = "/about-us";
export const LOGIN_URL = "/login";
export const REGISTER_URL = "/register";
export const ADMIN_URL = "/admin";

// SERVER URL
export const SERVER_URL = "https://www.gracious-kare.cloud/be";
export const CERTS_URL = `${SERVER_URL}/certs`;
export const USERS_URL = `${SERVER_URL}/users`;
export const AUTH_URL = `${SERVER_URL}/auth`;
export const SERIAL_URL = `${SERVER_URL}/serial`;
export const ACCESS_LOGS_URL = `${SERVER_URL}/accessLogs`;
export const DATABASE_LOGS_URL = `${SERVER_URL}/databaseLogs`;
export const SECURITY_LOGS_URL = `${SERVER_URL}/securityLogs`;

// CERT API
export const CREATE_CERT_API = `${CERTS_URL}/create-cert`;
export const CREATE_CERTS_API = `${CERTS_URL}/create-certs`;
export const GET_ALL_CERTS_API = `${CERTS_URL}/all-certs`;
export const GET_CERT_API = `${CERTS_URL}/:certID`;
export const GET_CERTS_BY_EMAIL_API = `${CERTS_URL}/email/`;
export const UPDATE_CERT_API = `${CERTS_URL}/:certID`;
export const DELETE_CERT_API = `${CERTS_URL}/`;
export const TRANSFER_OWNERSHIP_API = `${CERTS_URL}/transfer-ownership`;

// USER API
export const CREATE_USER_API = `${USERS_URL}/`;
export const GET_ALL_USERS_API = `${USERS_URL}/all-users`;
export const GET_USER_API = `${USERS_URL}/:email`;
export const UPDATE_USER_API = `${USERS_URL}/`;
export const DELETE_USER_API = `${USERS_URL}/`;
export const UPDATE_USER_ADMIN_API = `${USERS_URL}/admin`;

// AUTH API
export const CHECK_AUTH_API = `${AUTH_URL}/check-auth`;
export const REGISTER_API = `${AUTH_URL}/register`;
export const LOGIN_API = `${AUTH_URL}/login`;
export const LOGOUT_API = `${AUTH_URL}/logout`;
export const GENERATE_OTP_API = `${AUTH_URL}/generate-otp`;
export const VERIFY_OTP_API = `${AUTH_URL}/verify-otp`;
export const OTP_TIME_LEFT = `${AUTH_URL}/timeleft-otp`;
export const RESET_PASSWORD_API = `${AUTH_URL}/reset-password`;
export const UPDATE_PASSWORD_API = `${AUTH_URL}/update-password`;
export const GENERATE_CSRF_TOKEN = `${AUTH_URL}/generate-csrf-token`;

// ACCESS LOGS API
export const GET_ALL_ACCESS_LOGS = `${ACCESS_LOGS_URL}/all-access-logs`;

// DATABASE LOGS API
export const GET_ALL_DATABASE_LOGS = `${DATABASE_LOGS_URL}/all-database-logs`;

// SECURITY LOGS API
export const GET_ALL_SECURITY_LOGS = `${SECURITY_LOGS_URL}/all-security-logs`;

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
export const GENDER = ["Male", "Female"];
