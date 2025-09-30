import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const bucketName = process.env.S3_BUCKET_NAME || "pharmacy-prescriptions";

export class S3Service {
  /**
   * Upload file buffer to S3
   */
  static async uploadFile(
    buffer: Buffer,
    key: string,
    contentType: string = "application/octet-stream"
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      });

      await s3Client.send(command);
      return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw new Error("Failed to upload file to S3");
    }
  }

  /**
   * Generate presigned URL for file upload (for direct client uploads)
   */
  static async generateUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: contentType,
      });

      return await getSignedUrl(s3Client, command, { expiresIn });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      throw new Error("Failed to generate upload URL");
    }
  }

  /**
   * Generate presigned URL for file download
   */
  static async generateDownloadUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      return await getSignedUrl(s3Client, command, { expiresIn });
    } catch (error) {
      console.error("Error generating download URL:", error);
      throw new Error("Failed to generate download URL");
    }
  }

  /**
   * Delete file from S3
   */
  static async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      await s3Client.send(command);
    } catch (error) {
      console.error("Error deleting from S3:", error);
      throw new Error("Failed to delete file from S3");
    }
  }

  /**
   * Generate S3 key for prescription files
   */
  static generatePrescriptionKey(
    prescriptionId: string,
    fileName: string
  ): string {
    const timestamp = Date.now();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    return `prescriptions/${prescriptionId}/${timestamp}_${cleanFileName}`;
  }

  /**
   * Check if S3 is properly configured
   */
  static isConfigured(): boolean {
    return !!(
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_REGION &&
      process.env.S3_BUCKET_NAME
    );
  }
}