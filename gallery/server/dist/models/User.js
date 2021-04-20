"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    photos: { type: Array, required: true },
    albums: { type: Array, required: true }
});
exports.User = mongoose_1.model('user', schema);
//# sourceMappingURL=User.js.map