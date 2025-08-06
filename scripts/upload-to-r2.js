#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

class R2Uploader {
    constructor(accountId, accessKeyId, secretAccessKey, bucketName) {
        this.bucketName = bucketName;
        this.client = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        });
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

            // Generate unique key with timestamp
            const timestamp = Date.now();
            const key = `screenshots/${timestamp}-${fileName}`;

            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: fileBuffer,
                ContentType: contentType,
            });

            await this.client.send(command);

            // Construct public URL if custom domain is set
            const customDomain = process.env.R2_PUBLIC_DOMAIN;
            const url = customDomain
                ? `https://${customDomain}/${key}`
                : `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${this.bucketName}/${key}`;

            return url;
        } catch (error) {
            console.error(`Failed to upload ${filePath}:`, error.message);
            throw error;
        }
    }

    async findPngFiles(directoryPath) {
        const pngFiles = [];

        async function scanDirectory(currentPath) {
            try {
                const entries = await fs.readdir(currentPath, { withFileTypes: true });

                for (const entry of entries) {
                    const fullPath = path.join(currentPath, entry.name);

                    if (entry.isDirectory()) {
                        await scanDirectory(fullPath);
                    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
                        pngFiles.push(fullPath);
                    }
                }
            } catch (error) {
                console.warn(`Could not scan directory ${currentPath}:`, error.message);
            }
        }

        await scanDirectory(directoryPath);
        return pngFiles;
    }

    async uploadDirectory(directoryPath) {
        try {
            const pngFiles = await this.findPngFiles(directoryPath);

            if (pngFiles.length === 0) {
                console.log('No PNG files found in directory and subdirectories');
                return [];
            }

            console.log(`Found ${pngFiles.length} PNG files to upload`);
            const uploadResults = [];

            for (const filePath of pngFiles) {
                const fileName = path.basename(filePath);
                const relativePath = path.relative(directoryPath, filePath);

                try {
                    const url = await this.uploadImage(filePath);
                    uploadResults.push({
                        fileName: fileName,
                        relativePath: relativePath,
                        url: url,
                        success: true
                    });
                    console.log(`✓ Uploaded: ${relativePath} -> ${url}`);
                } catch (error) {
                    uploadResults.push({
                        fileName: fileName,
                        relativePath: relativePath,
                        error: error.message,
                        success: false
                    });
                    console.error(`✗ Failed: ${relativePath} - ${error.message}`);
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
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;
    const screenshotsPath = process.env.SCREENSHOTS_PATH || '/tmp/playwright-mcp-output';

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
        console.error('Error: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME environment variables are required');
        console.error('Optional: R2_PUBLIC_DOMAIN for custom domain, SCREENSHOTS_PATH for custom screenshot directory');
        process.exit(1);
    }

    try {
        const uploader = new R2Uploader(accountId, accessKeyId, secretAccessKey, bucketName);

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

module.exports = { R2Uploader };