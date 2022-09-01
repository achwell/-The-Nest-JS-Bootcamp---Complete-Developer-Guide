import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Post,
  Put
} from "@nestjs/common";
import { ReportService } from "./report.service";
import ReportType from "../types/ReportType";
import { CreateReportDto, ReportResponseDto, UpdateReportDto } from "../dtos/report.dto";

@Controller("report/:type")
export class ReportController {

  constructor(private readonly reportService: ReportService) {
  }

  @Get()
  getAllReports(@Param("type", new ParseEnumPipe(ReportType)) type: ReportType): ReportResponseDto[] {
    return this.reportService.getAllReports(type);
  }

  @Get(":id")
  getReportById(@Param("type", new ParseEnumPipe(ReportType)) type: ReportType, @Param("id", ParseUUIDPipe) id: string): ReportResponseDto {
    return this.reportService.getReportById(type, id);
  }

  @HttpCode(201)
  @Post()
  createReport(@Param("type", new ParseEnumPipe(ReportType)) type: ReportType, @Body() body: CreateReportDto): ReportResponseDto {
    return this.reportService.createReport(type, body);
  }

  @Put(":id")
  updateReport(@Param("type", new ParseEnumPipe(ReportType)) type: ReportType, @Param("id", ParseUUIDPipe) id: string, @Body() body: UpdateReportDto): ReportResponseDto {
    return this.reportService.updateReport(type, id, body);
  }

  @HttpCode(204)
  @Delete(":id")
  deleteReport(@Param("type", new ParseEnumPipe(ReportType)) type: ReportType, @Param("id", ParseUUIDPipe) id: string) {
    this.reportService.deleteReport(type, id);
  }
}
