import { Controller, Get, Param } from "@nestjs/common";
import { ClubsService } from "./clubs.service";

@Controller("clubs")
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Get()
  list() {
    return { data: this.clubsService.list() };
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return { data: this.clubsService.findOne(id) };
  }
}

