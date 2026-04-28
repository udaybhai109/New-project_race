"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubsService = void 0;
const common_1 = require("@nestjs/common");
let ClubsService = class ClubsService {
    list() {
        return [
            { id: "club_mumbai_runners", name: "Mumbai Runners", memberCount: 412 },
            { id: "club_hyrox_india", name: "Hyrox India", memberCount: 166 }
        ];
    }
    findOne(clubId) {
        return this.list().find((club) => club.id === clubId) ?? null;
    }
};
exports.ClubsService = ClubsService;
exports.ClubsService = ClubsService = __decorate([
    (0, common_1.Injectable)()
], ClubsService);
//# sourceMappingURL=clubs.service.js.map