import { Request, Response, NextFunction } from 'express';
import { PDFGeneratorService } from '../services/pdf-generator.service';

const pdfGenerator = new PDFGeneratorService();

export class ReportController {
  /**
   * Generate and download PDF report for an assessment
   * GET /api/v1/reports/assessment/:id/pdf
   */
  async generatePDF(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id: assessmentId } = req.params;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      // Generate PDF stream
      const pdfStream = await pdfGenerator.generateReport({
        assessmentId,
        userId,
      });

      // Set response headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="Digital-Readiness-Assessment-${assessmentId}.pdf"`
      );

      // Pipe PDF stream to response
      pdfStream.pipe(res);

      // Handle stream errors
      pdfStream.on('error', (error) => {
        console.error('PDF generation error:', error);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error generating PDF report' });
        }
      });
    } catch (error: any) {
      // Check for specific error messages
      if (error.message === 'Assessment not found or not completed') {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  }
}
