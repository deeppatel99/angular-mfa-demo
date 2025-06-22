import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mfa',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './mfa.component.html',
  styleUrls: ['./mfa.component.css'],
})
export class MfaComponent {
  username = 'testuser';
  qrcodeUrl: string = '';
  otpCode: string = '';
  verificationResult: string = '';
  isLoading = false;

  constructor(private http: HttpClient) {}

  generateQRCode() {
    this.isLoading = true;
    this.qrcodeUrl = '';
    this.http
      .post<any>('https://angular-mfa-demo-y7uh.onrender.com/generate-qrcode', {
        username: this.username,
      })
      .subscribe(
        (response) => {
          this.qrcodeUrl = response.qrcode;
          this.isLoading = false;
        },
        (error) => {
          console.error('QR Code Generation Failed:', error);
          this.isLoading = false;
        }
      );
  }

  verifyOTP() {
    if (!this.otpCode) {
      this.verificationResult = '⚠️ Please enter an OTP!';
      return;
    }

    this.isLoading = true;
    this.http
      .post<any>('https://angular-mfa-demo-y7uh.onrender.com/verify-otp', {
        username: this.username,
        token: this.otpCode,
      })
      .subscribe(
        (response) => {
          this.verificationResult = response.success
            ? '✅ OTP Verified Successfully!'
            : '❌ Invalid OTP, please try again.';
          this.isLoading = false;
        },
        (error) => {
          console.error('OTP Verification Failed:', error);
          this.verificationResult = '❌ Error verifying OTP. Please try again.';
          this.isLoading = false;
        }
      );
  }
}
