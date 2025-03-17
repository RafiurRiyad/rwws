import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/badRequest.error";
import { Success } from "../responses/http.response";
import path from "path";
import { NotFoundError } from "../errors/notFound.error";
import { ProgramDAO } from "../dao/program.dao";
import {
    generateProgramEntityObject,
    generateUpdateProgramEntityObject,
} from "../utilities/program.utility";
import { ProgramDTO } from "../dto/program.dto";
import { ProgramRepository } from "../repositories/program.repository";
import { ProgramGoalRepository } from "../repositories/programGoal.repository";
import { ProgramLocationRepository } from "../repositories/programLocation.repository";
import { ProgramAchivementRepository } from "../repositories/programAchievement.repository";
import { ProgramSearchParam } from "../interfaces/programSearchParam.interface";
import { Logger } from "../loggers/logger";
import { Program } from "../entities/program.entity";

const programDao = new ProgramDAO();

const createOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createRequest = res.locals.reqBody;
        if (!req.file) {
            throw new BadRequestError(
                "image-not-present",
                "Please provide required program image",
                3013
            );
        }

        createRequest.image = path.join("/uploads/", req.file.filename);

        const programEntityObj = await generateProgramEntityObject(createRequest);
        const createdProgram = await programDao.save(programEntityObj);

        const programDTO = new ProgramDTO(createdProgram);

        return Success(res, {
            message: "Successfully created program",
            data: programDTO,
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "createOne-program-base-error";
        error.message = error.message ? error.message : "createOne-program-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, pageSize, categoryId, status }: ProgramSearchParam = req.query;
        Logger.debug("query-param %s", req.query);

        if (!page || !pageSize || (pageSize && pageSize > 100)) {
            throw new NotFoundError(
                "program-search-pageSize-more-than-100",
                "program search page or page size not given or page size is more than 100",
                3087
            );
        }

        const queryBuilder = ProgramRepository.createQueryBuilder("program")
            .innerJoinAndSelect("program.category", "category")
            .leftJoinAndSelect("program.locations", "locations")
            .leftJoinAndSelect("program.goals", "goals")
            .leftJoinAndSelect("program.achievements", "achievements");

        if (categoryId) {
            queryBuilder.where("`category`.id = :categoryId", { categoryId });
        }

        if (status) {
            queryBuilder.andWhere("program.status = :status", { status });
        }

        queryBuilder.orderBy("program.updated_at", "DESC");

        const pageNumber = page || 1;
        const itemsPerPage = pageSize || 10;
        const skip = (pageNumber - 1) * itemsPerPage;

        const totalCount = await queryBuilder.getCount();
        queryBuilder.skip(skip).take(pageSize);

        const programData: Program[] = await queryBuilder.getMany();
        const programList = programData.map(program => new ProgramDTO(program));
        return Success(res, {
            message: "Programs fetched",
            data: {
                programList: programList,
                total_count: totalCount,
            },
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "getAll-program-base-error";
        error.message = error.message ? error.message : "getAll-program-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { programId } = req.params;
        const fetchedProgram = await programDao.findOneById(programId);

        if (!fetchedProgram) {
            throw new NotFoundError(
                "getOne-no-program-with-provided-id",
                "No program found or the program id is invalid",
                3015
            );
        }
        const programDTO = new ProgramDTO(fetchedProgram);
        return Success(res, {
            message: "Program details fetched",
            data: programDTO,
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "getOne-program-base-error";
        error.message = error.message ? error.message : "getOne-program-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

const updateOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateProgramRequestBody = res.locals.reqBody;
        const { programId } = req.params;

        const targetProgram = await programDao.findOneById(programId);
        if (!targetProgram) {
            throw new NotFoundError(
                "updateOne-no-program-with-provided-id",
                "No program found or the program id is invalid",
                3016
            );
        }
        req.file
            ? (updateProgramRequestBody.image = path.join("/uploads/", req.file.filename))
            : (updateProgramRequestBody.image = targetProgram.image);

        const updatedProgramEntityObj = await generateUpdateProgramEntityObject(
            updateProgramRequestBody,
            targetProgram
        );

        const updatedProgram = await programDao.save(updatedProgramEntityObj);
        const programDTO = new ProgramDTO(updatedProgram);

        return Success(res, {
            message: "Program details updated",
            data: programDTO,
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "getOne-program-base-error";
        error.message = error.message ? error.message : "getOne-program-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { programId } = req.params;
        const fetchedProgram = await programDao.findOneById(programId);

        if (!fetchedProgram) {
            throw new NotFoundError(
                "deleteOne-no-program-with-provided-id",
                "No program found or the program id is invalid",
                3016
            );
        }

        if (fetchedProgram.goals && fetchedProgram.goals.length > 0) {
            await ProgramGoalRepository.remove(fetchedProgram.goals);
        }

        if (fetchedProgram.locations && fetchedProgram.locations.length > 0) {
            await ProgramLocationRepository.remove(fetchedProgram.locations);
        }

        if (fetchedProgram.achievements && fetchedProgram.achievements.length > 0) {
            await ProgramAchivementRepository.remove(fetchedProgram.achievements);
        }

        await ProgramRepository.remove(fetchedProgram);

        return Success(res, {
            message: "Program removed successfully",
            data: null,
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "deleteOne-program-base-error";
        error.message = error.message ? error.message : "deleteOne-program-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

export const programController = {
    createOne,
    updateOne,
    getAll,
    getOne,
    deleteOne,
};
