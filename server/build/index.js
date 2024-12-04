"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./routes/user");
const product_1 = require("./routes/product");
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
//middlewear
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/user", user_1.userRouter);
app.use("/product", product_1.productRouter);
mongoose_1.default.connect("mongodb+srv://stefanocumbo72:ecommercepassword@ecommerce.edt3v.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Could not cinnect to MongoDB", err));
app.listen(port, () => {
    console.log("Server started!");
});
