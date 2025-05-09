import { defineStackbitConfig, SiteMapEntry } from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  nodeVersion: '18',
  ssgName: 'custom',
  devCommand: 'npx vite --port {PORT}',

  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ['src/content'],
      models: [
        // Workshop step model
        {
          name: 'WorkshopStep',
          type: 'page',
          label: 'Workshop Step',
          urlPath: '/step/{stepNumber}',
          fields: [
            { name: 'title', type: 'string', label: 'Step Title', required: true },
            { name: 'stepNumber', type: 'number', label: 'Step Number', required: true },
            { name: 'description', type: 'string', label: 'Step Description' },
            { name: 'pageId', type: 'string', label: 'Page ID', hidden: true }
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

  // Custom sitemap implementation
  siteMap: ({ documents, models }) => {
    // If no documents are found, create a static sitemap
    if (!documents || documents.length === 0) {
      // Create a static sitemap with predefined steps
      return [
        { urlPath: '/step/1', stableId: 'step-1', label: 'Step 1: Introduction', isHomePage: true },
        { urlPath: '/step/2', stableId: 'step-2', label: 'Step 2: Define Your Big Idea', isHomePage: false },
        { urlPath: '/step/3', stableId: 'step-3', label: 'Step 3: Clarify Your Underlying Goal', isHomePage: false },
        { urlPath: '/step/4', stableId: 'step-4', label: 'Step 4: Identify Trigger Events', isHomePage: false },
        { urlPath: '/step/5', stableId: 'step-5', label: 'Step 5: Define Customer Jobs', isHomePage: false },
        { urlPath: '/step/6', stableId: 'step-6', label: 'Step 6: Target Buyers', isHomePage: false },
        { urlPath: '/step/7', stableId: 'step-7', label: 'Step 7: Painstorming', isHomePage: false },
        { urlPath: '/step/8', stableId: 'step-8', label: 'Step 8: Problem Up', isHomePage: false },
        { urlPath: '/step/9', stableId: 'step-9', label: 'Step 9: Define Your Focused Target Market', isHomePage: false },
        { urlPath: '/step/10', stableId: 'step-10', label: 'Step 10: Refine Your Idea', isHomePage: false },
        { urlPath: '/step/11', stableId: 'step-11', label: 'Step 11: Summary', isHomePage: false }
      ] as SiteMapEntry[];
    }

    // Filter for page models
    const pageModels = models.filter(m => m.type === 'page').map(m => m.name);

    // Map documents to sitemap entries
    return documents
      .filter(d => pageModels.includes(d.modelName))
      .map(document => {
        // For workshop steps
        if (document.modelName === 'WorkshopStep') {
          const stepNumber = document.fields.stepNumber?.value;
          const title = document.fields.title?.value;

          if (!stepNumber) {
            return null;
          }

          return {
            stableId: `step-${stepNumber}`,
            urlPath: `/step/${stepNumber}`,
            document,
            label: title ? `Step ${stepNumber}: ${title}` : `Step ${stepNumber}`,
            isHomePage: stepNumber === 1
          };
        }

        return null;
      })
      .filter(Boolean) as SiteMapEntry[];
  },

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
