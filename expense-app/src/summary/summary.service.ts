import { Injectable } from "@nestjs/common";
import { ReportService } from "../report/report.service";
import ReportType from "../types/ReportType";

@Injectable()
export class SummaryService {

  constructor(private readonly reportService: ReportService) {
  }
  calculateSummary() {
    const totalExpences = this.getSum(ReportType.EXPENSE);
    const totalIncome = this.getSum(ReportType.INCOME);

    return {
      totalIncome,
      totalExpences,
      netIncome: totalIncome - totalExpences
    }
  }

  private getSum(type: ReportType) {
    return this.reportService
      .getAllReports(type)
      .map(value => value.amount)
      .reduce((sum, report) => sum + report, 0);
  }
}
