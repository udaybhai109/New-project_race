import { Controller, Get, Param } from "@nestjs/common";
import { ValidationService } from "./validation.service";

@Controller("validation")
export class ValidationController {
  constructor(private readonly validationService: ValidationService) {}

  @Get(":activityId")
  getVerdict(@Param("activityId") activityId: string) {
    return { data: this.validationService.getVerdict(activityId) };
  }
}
