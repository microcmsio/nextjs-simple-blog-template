#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

class MicroCMSUploader {
  constructor(serviceDomain, apiKey) {
    this.serviceDomain = serviceDomain;
    this.apiKey = apiKey;
    this.baseUrl = `https://${serviceDomain}.microcms-management.io`;
  }

  async uploadImage(filePath) {
    try {
      const fileBuffer = await fs.readFile(filePath);
      const fileName = path.basename(filePath);
      const fileExtension = path.extname(filePath).toLowerCase();
      
      // Content-Type determination
      let contentType;
      switch (fileExtension) {
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        default:
          throw new Error(`Unsupported file type: ${fileExtension}`);
      }

      // Create FormData
      const boundary = '----formdata-boundary-' + Date.now();
      const formData = [
        `--${boundary}`,
        `Content-Disposition: form-data; name="file"; filename="${fileName}"`,
        `Content-Type: ${contentType}`,
        '',
        fileBuffer.toString('binary'),
        `--${boundary}--`
      ].join('\r\n');

      const response = await fetch(`${this.baseUrl}/api/v1/media`, {
        method: 'POST',
        headers: {
          'X-MICROCMS-API-KEY': this.apiKey,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': Buffer.byteLength(formData, 'binary')
        },
        body: Buffer.from(formData, 'binary')
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error(`Failed to upload ${filePath}:`, error.message);
      throw error;
    }
  }

  async uploadDirectory(directoryPath) {
    try {
      const files = await fs.readdir(directoryPath);
      const imageFiles = files.filter(file => 
        /\.(png|jpg|jpeg)$/i.test(file)
      );

      if (imageFiles.length === 0) {
        console.log('No image files found in directory');
        return [];
      }

      const uploadResults = [];
      
      for (const file of imageFiles) {
        const filePath = path.join(directoryPath, file);
        try {
          const url = await this.uploadImage(filePath);
          uploadResults.push({
            fileName: file,
            url: url,
            success: true
          });
          console.log(`✓ Uploaded: ${file} -> ${url}`);
        } catch (error) {
          uploadResults.push({
            fileName: file,
            error: error.message,
            success: false
          });
          console.error(`✗ Failed: ${file} - ${error.message}`);
        }
      }

      return uploadResults;
    } catch (error) {
      console.error('Failed to process directory:', error.message);
      throw error;
    }
  }
}

async function main() {
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;
  const screenshotsPath = process.env.PLAYWRIGHT_SCREENSHOTS_PATH || './playwright-screenshots';

  if (!serviceDomain || !apiKey) {
    console.error('Error: MICROCMS_SERVICE_DOMAIN and MICROCMS_API_KEY environment variables are required');
    process.exit(1);
  }

  try {
    const uploader = new MicroCMSUploader(serviceDomain, apiKey);
    
    // Check if screenshots directory exists
    try {
      await fs.access(screenshotsPath);
    } catch (error) {
      console.log(`Screenshots directory not found: ${screenshotsPath}`);
      process.exit(0);
    }

    console.log(`Uploading screenshots from: ${screenshotsPath}`);
    const results = await uploader.uploadDirectory(screenshotsPath);
    
    const successfulUploads = results.filter(r => r.success);
    const failedUploads = results.filter(r => !r.success);

    console.log(`\nUpload Summary:`);
    console.log(`✓ Successful: ${successfulUploads.length}`);
    console.log(`✗ Failed: ${failedUploads.length}`);

    // Output results as JSON for GitHub Actions
    if (process.env.GITHUB_ACTIONS === 'true') {
      const output = {
        successful: successfulUploads,
        failed: failedUploads,
        total: results.length
      };
      console.log('\n--- UPLOAD_RESULTS_JSON ---');
      console.log(JSON.stringify(output, null, 2));
      console.log('--- END_UPLOAD_RESULTS_JSON ---');
    }

    // Exit with error code if any uploads failed
    if (failedUploads.length > 0) {
      process.exit(1);
    }

  } catch (error) {
    console.error('Upload script failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { MicroCMSUploader };