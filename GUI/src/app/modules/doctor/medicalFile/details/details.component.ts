import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MedicalFile } from 'app/shared/models/medicalFile/medical-file';
import { MedicalFileService } from 'app/shared/services/medicalFileService/medical-file.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class MedicalFileDetailsComponent implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  medicalFile: MedicalFile;
  currentDate: string;

  constructor(
    private medicalFileService: MedicalFileService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const medicalFileId = params['id'];
      if (medicalFileId) {
        this.loadMedicalFile(medicalFileId);
      }
    });

    this.setCurrentDate();
  }

  loadMedicalFile(medicalFileId: string): void {
    this.medicalFileService.getMedicalFileById(medicalFileId).subscribe({
        next: (file) => {
            this.medicalFile = file;
            // Ensure the date is a Date object
            if (typeof this.medicalFile.date === 'string') {
                this.medicalFile.date = new Date(this.medicalFile.date);
            }
        },
        error: (err) => {
            console.error('Error loading medical file:', err); 
        }
    });
}


  setCurrentDate(): void {
    const date = new Date();
    this.currentDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  downloadPDF(): void {
    const data = this.content.nativeElement;
    html2canvas(data, { scale: 2 }).then(canvas => {
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      let position = 0;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('medical-file.pdf'); // Generated PDF
    });
  }
}
