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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeExecution = void 0;
const api_1 = require("./api");
class CodeExecution {
    constructor(code, contestId, userId, codeId) {
        this.code = code;
        this.contestId = contestId;
        this.userId = userId;
        this.codeId = codeId;
        this.status = "";
    }
    createSubmission() {
        return __awaiter(this, void 0, void 0, function* () {
            const base64Code = Buffer.from(this.code).toString("base64");
            const languageId = parseInt(this.codeId);
            const result = yield (0, api_1.postSubmission)(base64Code, languageId);
            console.log(result);
        });
    }
}
exports.CodeExecution = CodeExecution;
