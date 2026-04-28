import { Controller, Get, Param } from "@nestjs/common";
import { ShareService } from "./share.service";

@Controller("share")
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Get(":activityId")
  getShare(@Param("activityId") activityId: string) {
    return this.shareService.getShare(activityId);
  }
}
