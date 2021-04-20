"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const api_auth_1 = require("./api/routes/api-auth");
const api_user_1 = require("./api/routes/api-user");
const app = express_1.default();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const PORT = config_1.default.get('port') || 8000;
const uri = config_1.default.get('mongoUri');
app.use(express_1.default.static(path_1.default.join(__dirname, '../../', 'client/build')));
app.get('(/|/gallery|/login|/registration)', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../', 'client/build', 'index.html'));
});
app.use(cors_1.default());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('public/uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/auth', api_auth_1.authRouter);
app.use('/api/user', api_user_1.photosRouter);
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(uri, {
                useCreateIndex: true,
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useFindAndModify: false
            });
            http.listen(PORT, () => {
                console.log(`Server has been started on port ${PORT}...`);
            });
        }
        catch (e) {
            console.log(e.message);
            process.exit(1);
        }
    });
}
start();
//# sourceMappingURL=index.js.map