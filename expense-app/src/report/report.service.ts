import { Injectable } from '@nestjs/common';
import ReportType from "../types/ReportType";
import { data } from "../data";
import { CreateReportDto, ReportResponseDto } from "../dtos/report.dto";
import Report from "../types/Report";
import { v4 as uuid } from "uuid";


interface UpdateReport {
  amount?: number;
  source?: string;
}
@Injectable()
export class ReportService {

  getAllReports(type: ReportType) {
    return data.report
      .filter(report => report.type === type)
      .map(report => {
        return new ReportResponseDto(report);
      });
  }

  getReportById(type: ReportType, id: string) {
    const report = data.report
      .filter(report => report.type === type)
      .find(report => report.id === id);
    if (!report) {
      return null;
    }
    return new ReportResponseDto(report);
  }

  createReport(type: ReportType, report: CreateReportDto) {
    const newReport: Report = {
      ...report,
      id: uuid(),
      type,
      created_at: new Date(),
      updated_at: new Date()
    };
    data.report.push(newReport);
    return new ReportResponseDto(newReport);
  }

  updateReport(type: ReportType, id: string, report: UpdateReport) {
    const reportToUpdate = this.getReportById(type, id);
    if (!reportToUpdate) {
      return;
    }
    const reportIndex = data.report.findIndex(r => r.id === id);
    data.report[reportIndex] = {
      ...reportToUpdate,
      source: report.source ? report.source : reportToUpdate.source,
      amount: report.amount ? report.amount : reportToUpdate.amount,
      updated_at: new Date()
    };
    return new ReportResponseDto(data.report[reportIndex]);
  }

  deleteReport(type: ReportType, id: string) {
    const reportIndex = data.report.findIndex(r => r.id === id);
    if (reportIndex === -1) {
      return;
    }
    data.report.splice(reportIndex, 1);
    return;
  }
}
