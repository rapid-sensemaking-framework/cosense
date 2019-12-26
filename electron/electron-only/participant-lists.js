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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require("fs");
var folders_1 = require("../folders");
var getParticipantListPath = function (slug) {
    return folders_1.PARTICIPANT_LISTS_PATH + "/" + slug + ".json";
};
var getParticipantListAsObject = function (participantListId) {
    var participantListPath = getParticipantListPath(participantListId);
    var participantListString = fs.readFileSync(participantListPath, {
        encoding: 'utf8'
    });
    var participantList = JSON.parse(participantListString);
    return participantList;
};
var writeParticipantList = function (participantListId, participantList) {
    var participantListPath = getParticipantListPath(participantListId);
    fs.writeFileSync(participantListPath, JSON.stringify(participantList, null, 2));
    return true;
};
var updateParticipantList = function (updatedParticipantList) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, writeParticipantList(updatedParticipantList.slug, updatedParticipantList)];
    });
}); };
exports.updateParticipantList = updateParticipantList;
var createParticipantList = function (participantList) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        writeParticipantList(participantList.slug, participantList);
        return [2 /*return*/, true];
    });
}); };
exports.createParticipantList = createParticipantList;
var getParticipantLists = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                fs.readdir(folders_1.PARTICIPANT_LISTS_PATH, function (err, files) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    // filter out .DS_Store and any other weird files
                    var participantLists = files
                        .filter(function (f) { return f.includes('.json'); })
                        .map(function (filename) {
                        var participantListPath = folders_1.PARTICIPANT_LISTS_PATH + "/" + filename;
                        var participantListString = fs.readFileSync(participantListPath, {
                            encoding: 'utf8'
                        });
                        var participantList = JSON.parse(participantListString);
                        return participantList;
                    });
                    resolve(participantLists);
                });
            })];
    });
}); };
exports.getParticipantLists = getParticipantLists;
var getParticipantList = function (slug) { return __awaiter(void 0, void 0, void 0, function () {
    var participantList;
    return __generator(this, function (_a) {
        try {
            participantList = getParticipantListAsObject(slug);
        }
        catch (e) {
            console.log(e);
        }
        return [2 /*return*/, participantList];
    });
}); };
exports.getParticipantList = getParticipantList;
//# sourceMappingURL=participant-lists.js.map