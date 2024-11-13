"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = __importDefault(require("./utils/logger"));
const config_1 = __importDefault(require("./utils/config"));
const users_1 = __importDefault(require("./controllers/users"));
const mongoose_1 = __importDefault(require("mongoose"));
const middleware_1 = __importDefault(require("./utils/middleware"));
const projects_1 = __importDefault(require("./controllers/projects"));
const aboutMePosts_1 = __importDefault(require("./controllers/aboutMePosts"));
const login_1 = __importDefault(require("./controllers/login"));
const emailContact_1 = __importDefault(require("./controllers/emailContact"));
const visitor_1 = __importDefault(require("./controllers/visitor"));
const path_1 = __importDefault(require("path"));
mongoose_1.default.set('strictQuery', false);
if (typeof config_1.default.MONGODB_URI === 'string') {
    logger_1.default.info('connecting to', config_1.default.MONGODB_URI);
    mongoose_1.default
        .connect(config_1.default.MONGODB_URI)
        .then(() => {
        logger_1.default.info('Connected to MongoDB');
    })
        .catch(error => {
        if (error &&
            typeof error === 'object' &&
            error.message &&
            typeof error.message === 'string') {
            logger_1.default.error('Error connecting to MongoDB', error.message);
        }
    });
}
const staticFilesPath = path_1.default.join(__dirname, '../../dist');
console.log(staticFilesPath);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static('public'));
app.use(express_1.default.static('dist'));
app.use(express_1.default.static(staticFilesPath));
app.use(middleware_1.default.requestLogger);
app.use('/api/user', users_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/aboutMe', aboutMePosts_1.default);
app.use('/api/login', login_1.default);
app.use('/api/email', emailContact_1.default);
app.use('/api/visitorLog', visitor_1.default);
app.get('*', (_req, res) => {
    res.sendFile(path_1.default.join(staticFilesPath, 'index.html'));
});
app.use(middleware_1.default.unknownEndpoint);
app.use(middleware_1.default.errorHandler);
exports.default = app;
