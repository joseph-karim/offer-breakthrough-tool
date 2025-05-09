import { defineStackbitConfig } from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  nodeVersion: '18',
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ['src'],
      models: [
        // Component models for workshop steps
        {
          name: 'workshopStep',
          type: 'object',
          label: 'Workshop Step',
          fields: [
            { name: 'title', type: 'string', label: 'Step Title' },
            { name: 'description', type: 'markdown', label: 'Step Description' },
            { name: 'placeholders', type: 'object', label: 'Input Placeholders' },
            { name: 'tooltips', type: 'object', label: 'Help Tooltips' },
            { name: 'examples', type: 'list', label: 'Examples', items: { type: 'string' } }
          ]
        }
      ],
      assetsConfig: {
        referenceType: 'static',
        staticDir: 'public',
        uploadDir: 'images',
        publicPath: '/',
      },
    }),
  ],
  // This is the critical part for your dev server:
  devCommand: 'npm run dev -- --port {PORT}',

  // Add annotations to help Stackbit identify editable regions
  // This tells Stackbit to look for data-sb-field-path attributes in your HTML
  annotations: {
    // Define patterns for identifying editable content
    // This helps Stackbit know which elements can be edited visually
    patterns: [
      {
        name: 'heading',
        label: 'Heading',
        selector: 'h1, h2, h3, h4, h5, h6',
      },
      {
        name: 'paragraph',
        label: 'Paragraph',
        selector: 'p',
      },
      {
        name: 'textarea',
        label: 'Text Input',
        selector: 'textarea',
      },
      {
        name: 'input',
        label: 'Input Field',
        selector: 'input[type="text"]',
      },
      {
        name: 'label',
        label: 'Label',
        selector: 'label',
      },
      {
        name: 'tooltip',
        label: 'Tooltip',
        selector: '[data-tooltip], [data-floating-tooltip]',
      }
    ]
  }
});
