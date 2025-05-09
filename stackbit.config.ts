import { defineStackbitConfig, SiteMapEntry } from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  nodeVersion: '18',
  ssgName: 'custom',
  devCommand: 'npx vite --port {PORT}',

  // Define sitemap with workshop steps
  siteMap: () => {
    // Create an array of workshop steps
    const workshopSteps = [
      { number: 1, title: 'Introduction' },
      { number: 2, title: 'Define Your Big Idea' },
      { number: 3, title: 'Clarify Your Underlying Goal' },
      { number: 4, title: 'Identify Trigger Events' },
      { number: 5, title: 'Define Customer Jobs' },
      { number: 6, title: 'Target Buyers' },
      { number: 7, title: 'Painstorming' },
      { number: 8, title: 'Problem Up' },
      { number: 9, title: 'Define Your Focused Target Market' },
      { number: 10, title: 'Refine Your Idea' },
      { number: 11, title: 'Summary' }
    ];

    // Map steps to sitemap entries
    return workshopSteps.map(step => ({
      urlPath: `/step/${step.number}`,
      stableId: `step-${step.number}`,
      label: `Step ${step.number}: ${step.title}`,
      isHomePage: step.number === 1
    })) as SiteMapEntry[];
  },

  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ['src'],
      assetsConfig: {
        referenceType: 'static',
        staticDir: 'public',
        uploadDir: 'images',
        publicPath: '/',
      },
    }),
  ],

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
