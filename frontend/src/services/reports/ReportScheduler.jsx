class ReportScheduler {
    constructor() {
      this.schedules = new Map();
      this.running = false;
    }
  
    schedule(reportConfig) {
      const {
        id,
        name,
        template,
        schedule,
        recipients,
        format,
        parameters
      } = reportConfig;
  
      const job = {
        name,
        template,
        schedule: this.parseCronSchedule(schedule),
        recipients,
        format,
        parameters,
        lastRun: null,
        nextRun: this.calculateNextRun(schedule)
      };
  
      this.schedules.set(id, job);
      if (!this.running) {
        this.start();
      }
    }
  
    async start() {
      this.running = true;
      while (this.running) {
        const now = new Date();
        
        for (const [id, job] of this.schedules) {
          if (job.nextRun <= now) {
            try {
              await this.runReport(id);
            } catch (error) {
              console.error(`Error running report ${id}:`, error);
            }
          }
        }
  
        await new Promise(resolve => setTimeout(resolve, 60000)); // Check every minute
      }
    }
  
    async runReport(jobId) {
      const job = this.schedules.get(jobId);
      if (!job) return;
  
      try {
        const report = await ReportGenerator.generate(
          job.template,
          job.parameters
        );
  
        const formattedReport = await ReportFormatter.format(
          report,
          job.format
        );
  
        await this.distributeReport(formattedReport, job.recipients);
  
        job.lastRun = new Date();
        job.nextRun = this.calculateNextRun(job.schedule);
        this.schedules.set(jobId, job);
  
      } catch (error) {
        throw new Error(`Failed to run report ${jobId}: ${error.message}`);
      }
    }
  
    async distributeReport(report, recipients) {
      for (const recipient of recipients) {
        switch (recipient.type) {
          case 'email':
            await EmailService.send({
              to: recipient.address,
              subject: 'Automated Report',
              attachments: [report]
            });
            break;
          case 'ftp':
            await FTPService.upload(report, recipient.path);
            break;
          case 'api':
            await APIService.post(recipient.endpoint, report);
            break;
        }
      }
    }
  }