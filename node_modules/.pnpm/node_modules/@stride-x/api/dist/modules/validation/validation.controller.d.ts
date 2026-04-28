import { ValidationService } from "./validation.service";
export declare class ValidationController {
    private readonly validationService;
    constructor(validationService: ValidationService);
    getVerdict(activityId: string): {
        data: import("@stride-x/domain-types").ValidationVerdict;
    };
}
//# sourceMappingURL=validation.controller.d.ts.map