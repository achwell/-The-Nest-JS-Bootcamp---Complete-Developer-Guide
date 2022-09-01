import Report from "./types/Report";
import ReportType from "./types/ReportType";

interface Data {
  report: Report[];
}

export const data: Data = {
  report: [
    {
      id: "5bea4822-e5ce-4e83-a468-583940795a84",
      source: "Salary",
      amount: 7500,
      created_at: new Date(),
      updated_at: new Date(),
      type: ReportType.INCOME
    },
    {
      id: "24c30735-9c82-488b-b528-c47a71edb023",
      source: "Youtube",
      amount: 2500,
      created_at: new Date(),
      updated_at: new Date(),
      type: ReportType.INCOME
    },
    {
      id: "0389d898-c90a-4487-8161-0f5a8cef7846",
      source: "Food",
      amount: 2500,
      created_at: new Date(),
      updated_at: new Date(),
      type: ReportType.EXPENSE
    }
  ]
};
