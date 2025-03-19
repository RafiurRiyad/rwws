import { Program } from "../entities/program.entity";
import { ProgramAchievement } from "../entities/programAchievement.entity";
import { ProgramGoal } from "../entities/programGoal.entity";
import { ProgramLocation } from "../entities/programLocation.entity";
import { CategoryType } from "../enums/categoryType.enum";
import { BadRequestError } from "../errors/badRequest.error";
import { CategoryRepository } from "../repositories/category.repository";
import { ProgramAchivementRepository } from "../repositories/programAchievement.repository";
import { ProgramGoalRepository } from "../repositories/programGoal.repository";
import { ProgramLocationRepository } from "../repositories/programLocation.repository";

export const generateProgramEntityObject = async (requestBodyObj: any): Promise<Program> => {
    const category = await CategoryRepository.findOneBy({
        id: requestBodyObj.category_id,
        type: CategoryType.PROGRAM,
    });
    if (!category) {
        throw new BadRequestError(
            "generateProgramEntityObject-for-create-program",
            "Program category not found",
            3015
        );
    }

    const program = new Program();
    program.title = requestBodyObj.title;
    program.description = requestBodyObj.description;
    program.longDescription = requestBodyObj.long_description;
    program.category = category;
    program.image = requestBodyObj.image;
    program.video = requestBodyObj.video;
    program.status = requestBodyObj.status;
    program.start_date = requestBodyObj.start_date ? new Date(requestBodyObj.start_date) : null;

    if (requestBodyObj.goals && Array.isArray(requestBodyObj.goals)) {
        program.goals = requestBodyObj.goals.map((g: string) => {
            const goal = new ProgramGoal();
            goal.goal = g;
            return goal;
        });
    }

    if (requestBodyObj.achievements && Array.isArray(requestBodyObj.achievements)) {
        program.achievements = requestBodyObj.achievements.map((ach: string) => {
            const achievement = new ProgramAchievement();
            achievement.achievement = ach;
            return achievement;
        });
    }

    if (requestBodyObj.locations && Array.isArray(requestBodyObj.locations)) {
        program.locations = requestBodyObj.locations.map((loc: string) => {
            const location = new ProgramLocation();
            location.location = loc;
            return location;
        });
    }

    return program;
};

export const generateUpdateProgramEntityObject = async (
    updateProgramRequestBody: any,
    program: Program
): Promise<Program> => {
    const category = await CategoryRepository.findOneBy({
        id: updateProgramRequestBody.category_id,
        type: CategoryType.PROGRAM,
    });
    if (!category) {
        throw new BadRequestError(
            "generateProgramEntityObject-for-create-program",
            "Program category not found",
            3015
        );
    }

    program.title = updateProgramRequestBody.title;
    program.description = updateProgramRequestBody.description;
    program.longDescription = updateProgramRequestBody.long_description;
    program.image = updateProgramRequestBody.image;
    program.video = updateProgramRequestBody.video;
    program.status = updateProgramRequestBody.status;
    program.start_date = updateProgramRequestBody.start_date
        ? new Date(updateProgramRequestBody.start_date)
        : program.start_date;

    if (updateProgramRequestBody.goals) {
        await ProgramGoalRepository.delete({ program: program });
        program.goals = updateProgramRequestBody.goals.map((g: string) => {
            const goal = new ProgramGoal();
            goal.goal = g;
            goal.program = program;
            return goal;
        });
    }

    if (updateProgramRequestBody.achievements) {
        await ProgramAchivementRepository.delete({ program: program });
        program.achievements = updateProgramRequestBody.achievements.map((ach: string) => {
            const achievement = new ProgramAchievement();
            achievement.achievement = ach;
            achievement.program = program;
            return achievement;
        });
    }

    if (updateProgramRequestBody.locations) {
        await ProgramLocationRepository.delete({ program: program });
        program.locations = updateProgramRequestBody.locations.map((loc: string) => {
            const location = new ProgramLocation();
            location.location = loc;
            location.program = program;
            return location;
        });
    }

    return program;
};
