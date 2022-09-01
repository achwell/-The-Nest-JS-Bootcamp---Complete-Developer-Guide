import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { SummaryModule } from './summary/summary.module';
import { ReportModule } from './report/report.module';
import { ReportService } from "./report/report.service";
import { ReportController } from "./report/report.controller";

@Module({
  imports: [SummaryModule, ReportModule],
  controllers: [ReportController],
  providers: [ReportService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }],
})
export class AppModule {}
