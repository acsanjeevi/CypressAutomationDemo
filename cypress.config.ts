import { defineConfig } from 'cypress';
import * as fs from 'fs';
import * as path from 'path';

export default defineConfig({
  e2e: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 20000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,
    video: true,
    screenshotOnRunFailure: true,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports/mochawesome-report',
      reportFilename: 'mochawesome-[status]_[datetime]',
      quiet: false,
      overwrite: false,
      html: true,
      json: true,
      charts: true,
      embeddedScreenshots: true,
      inlineAssets: true,
      saveJson: true,
      saveHtml: true,
    },
    setupNodeEvents(on, config) {
      // Task to write files
      on('task', {
        /**
         * Task: writeFile
         * Writes data to a JSON file in the test-data directory
         * Creates the directory if it doesn't exist
         * Appends new data to existing data (maintains history)
         * 
         * @param filename - Name of the file to write to (e.g., 'employees.json')
         * @param data - Data object or array to persist
         * @returns null (Cypress task requirement)
         */
        writeFile({ filename, data }: any) {
          const dataDir = path.join(__dirname, 'cypress/test-data');
          if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
          }
          const filePath = path.join(dataDir, filename);
          let existingData: any[] = [];
          
          // Read existing data if file exists
          if (fs.existsSync(filePath)) {
            try {
              const content = fs.readFileSync(filePath, 'utf-8');
              existingData = content ? JSON.parse(content) : [];
            } catch (e) {
              existingData = [];
            }
          }
          
          // Add new data
          if (Array.isArray(data)) {
            existingData = existingData.concat(data);
          } else {
            existingData.push(data);
          }
          
          // Write file
          fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
          console.log(`✓ Data saved to ${filePath}`);
          return null;
        },

        /**
         * Task: readFile
         * Reads data from a JSON file in the test-data directory
         * Returns parsed JSON data or empty array if file doesn't exist
         * 
         * @param filename - Name of the file to read from (e.g., 'employees.json')
         * @returns Parsed JSON array or empty array if file not found
         */
        readFile(filename: string) {
          const dataDir = path.join(__dirname, 'cypress/test-data');
          const filePath = path.join(dataDir, filename);
          
          if (fs.existsSync(filePath)) {
            try {
              const content = fs.readFileSync(filePath, 'utf-8');
              return content ? JSON.parse(content) : [];
            } catch (e) {
              console.error(`Error reading file ${filePath}:`, e);
              return [];
            }
          }
          return [];
        },

        /**
         * Task: deleteFile
         * Deletes a file from the test-data directory
         * Safe operation - returns success even if file doesn't exist
         * 
         * @param filename - Name of the file to delete (e.g., 'employees.json')
         * @returns null (Cypress task requirement)
         */
        deleteFile(filename: string) {
          const dataDir = path.join(__dirname, 'cypress/test-data');
          const filePath = path.join(dataDir, filename);
          
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
              console.log(`✓ File deleted: ${filePath}`);
            } catch (e) {
              console.error(`Error deleting file ${filePath}:`, e);
            }
          }
          return null;
        },

        /**
         * Task: clearDirectory
         * Clears all files from the test-data directory
         * Used for cleanup between test suites
         * 
         * @returns null (Cypress task requirement)
         */
        clearDirectory() {
          const dataDir = path.join(__dirname, 'cypress/test-data');
          if (fs.existsSync(dataDir)) {
            try {
              fs.readdirSync(dataDir).forEach((file) => {
                const filePath = path.join(dataDir, file);
                fs.unlinkSync(filePath);
              });
              console.log(`✓ Test data directory cleared`);
            } catch (e) {
              console.error(`Error clearing directory:`, e);
            }
          }
          return null;
        }
      });
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
