// Import required modules and libraries
import express from "express"; // Express.js for building the server
import cors from "cors"; // Middleware for enabling Cross-Origin Resource Sharing
import mongoose from "mongoose"; // Mongoose for interacting with MongoDB
import session from "express-session"; // Session management middleware
import MongoStore from "connect-mongo"; // Session store for MongoDB
import helmet from "helmet"; // Middleware for securing HTTP headers
import crypto from "crypto"; // Crypto library for generating nonces
import rateLimit from "express-rate-limit"; // Middleware for rate limiting
import cookieParser from "cookie-parser"; // Middleware for parsing cookies
import sanitize from "mongo-sanitize"; // Middleware for sanitizing input data
import escapeHtml from "escape-html";

// Import route handlers
import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/users.js";
import { certRouter } from "./routes/certs.js";
import { accessLogsRouter } from "./routes/accessLogs.js";
import { databaseLogsRouter } from "./routes/databaseLogs.js";
import { securityLogsRouter } from "./routes/securityLogs.js";

// Import constants for configuration
import { PORT, MONGODB_CONNECTION, SECRET, CRYPTOSECRET } from "./constants.js";

const app = express(); // Create an Express application

// Trust proxy to handle secure proxy headers (important for security)
app.set("trust proxy", true);

// Apply Helmet middleware for securing HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        // set alias for CSP same origin
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
      },
    },
    xFrameOptions: { action: "deny" }, // Deny X-Frame-Options
    strictTransportSecurity: {
      maxAge: 31536000, // HSTS max age (set to one year) for including subdomains
    },
  })
);

// Middleware for generating a Content Security Policy (CSP) nonce
app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
  next();
});

// Middleware to set Cache-Control headers
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache");
  next();
});

app.use(express.json()); // Parse JSON request bodies

mongoose.connect(MONGODB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); // Connect to MongoDB

// Get the default MongoDB connection
const db = mongoose.connection;

app.use(cookieParser()); // Parse cookies

// Session management with Express Session
app.use(
  session({
    secret: SECRET, // Session secret
    cookie: {
      secure: true, // Set to true for HTTPS
      httpOnly: true,
      signed: true,
      sameSite: "strict", // Helps mitigate CSRF attacks
    },
    proxy: true,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      client: db.getClient(),
      crypto: {
        secret: CRYPTOSECRET, // TO BE CHANGED: secret should be stored in an environment variable
      },
      autoRemove: "interval",
      autoRemoveInterval: 1, // Checks every 1 minute to delete expired sessions
      ttl: 30 * 60, // Sessions last for 30 minutes
    }),
  })
);

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 1 * 1000, // 1 second
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many requests, please try again later.",
});
app.use(apiLimiter); // Apply rate limiter to all routes

// Middleware for sanitizing input data from req.body, req.params, and req.query
app.use((req, res, next) => {
  if (Array.isArray(req.body)) {
    // Escaping HTML in the request body's array of objects
    req.body.forEach((obj) => {
      Object.keys(obj).forEach((key) => {
        obj[key] = escapeHtml(obj[key]);
      });
    });
  } else if (req.body) {
    // Escaping HTML in the request body as an object
    Object.keys(req.body).forEach((key) => {
      req.body[key] = escapeHtml(req.body[key]);
    });
  }

  if (req.params) {
    // Escaping HTML in request parameters
    Object.keys(req.params).forEach((key) => {
      req.params[key] = escapeHtml(req.params[key]);
    });
  }

  if (req.query) {
    // Escaping HTML in query parameters
    Object.keys(req.query).forEach((key) => {
      req.query[key] = escapeHtml(req.query[key]);
    });
  }

  req.body = sanitize(req.body);
  req.params = sanitize(req.params);
  req.query = sanitize(req.query);

  next();
});

// Define routes for various functionalities
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/certs", certRouter);
app.use("/accessLogs", accessLogsRouter);
app.use("/databaseLogs", databaseLogsRouter);
app.use("/securityLogs", securityLogsRouter);

// Event listeners for database connection status
db.on("connected", () => {
  console.log("Successful Mongoose connection");
});

db.on("error", (err) => {
  console.error("Something went wrong");
});

db.on("disconnected", () => {
  console.log("Mongoose connection disconnected");
});

// Define a simple root route
app.get("/", (req, res) => res.send("Dockerizing Node Application"));

// Example route for testing session
app.get("/test", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "No session" });
  }

  return res.status(200).json({ message: req.session });
});

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
