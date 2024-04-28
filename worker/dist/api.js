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
exports.getSubmission = exports.postSubmission = void 0;
const axios_1 = __importDefault(require("axios"));
function postSubmission(code, language_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method: "POST",
            url: "https://judge0-ce.p.rapidapi.com/submissions",
            params: {
                base64_encoded: "true",
                fields: "*",
            },
            headers: {
                "content-type": "application/json",
                "Content-Type": "application/json",
                "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
                "X-RapidAPI-Host": process.env.JUDGE0_API_HOST,
            },
            data: {
                language_id: language_id,
                source_code: code,
            },
        };
        try {
            const response = yield axios_1.default.request(options);
            return response.data;
        }
        catch (error) {
            return error;
        }
    });
}
exports.postSubmission = postSubmission;
function getSubmission(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method: "GET",
            url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
            params: {
                base64_encoded: "true",
                fields: "*",
            },
            headers: {
                "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
                "X-RapidAPI-Host": process.env.JUDGE0_API_HOST,
            },
        };
        try {
            const response = yield axios_1.default.request(options);
            return response.data;
        }
        catch (error) {
            return error;
        }
    });
}
exports.getSubmission = getSubmission;
