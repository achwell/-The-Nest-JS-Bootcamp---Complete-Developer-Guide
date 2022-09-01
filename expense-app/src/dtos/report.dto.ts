import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import ReportType from "../types/ReportType";
import { Exclude, Expose } from "class-transformer";

export class CreateReportDto {

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  source: string;
}

export class UpdateReportDto {

  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  source: string;
}

export class ReportResponseDto {

  constructor(partial: Partial<ReportResponseDto>) {
    Object.assign(this, partial);
  }

  id: string;
  source: string;
  amount: number;

  @Expose({name: "createdAt"})
  transformCreatedAt(){
    return this.created_at
  }

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
  type: ReportType;
}
