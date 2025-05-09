import { defineStackbitConfig, SiteMapEntry, getLocalizedFieldForLocale } from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  nodeVersion: '18',
  ssgName: 'custom',
  devCommand: 'npx vite --port {PORT}',

  // Define model extensions for URL mapping
  modelExtensions: [
    {
      name: 'page',
      type: 'page',
      urlPath: '/{slug}',
      fields: [{ name: 'pageId', type: 'string', hidden: true }]
    },
    {
      name: 'workshopStep',
      type: 'page',
      urlPath: '/step/{stepNumber}',
      fields: [{ name: 'pageId', type: 'string', hidden: true }]
    }
  ],

  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ['src/content'],
      models: [
        // Page model for the main pages
        {
          name: 'page',
          type: 'page',
          label: 'Page',
          fields: [
            { name: 'title', type: 'string', label: 'Title', required: true },
            { name: 'slug', type: 'string', label: 'Slug', required: true },
            { name: 'content', type: 'markdown', label: 'Content' },
            { name: 'pageId', type: 'string', label: 'Page ID', hidden: true }
          ]
        },
        // Workshop step model
        {
          name: 'workshopStep',
          type: 'page',
          label: 'Workshop Step',
          fields: [
            { name: 'title', type: 'string', label: 'Step Title', required: true },
            { name: 'stepNumber', type: 'number', label: 'Step Number', required: true },
            { name: 'description', type: 'markdown', label: 'Step Description' },
            { name: 'pageId', type: 'string', label: 'Page ID', hidden: true },
            { name: 'placeholders', type: 'object', label: 'Input Placeholders', fields: [
              { name: 'bigIdeaPlaceholder', type: 'string', label: 'Big Idea Placeholder' },
              { name: 'targetCustomersPlaceholder', type: 'string', label: 'Target Customers Placeholder' }
            ]},
            { name: 'tooltips', type: 'object', label: 'Help Tooltips', fields: [
              { name: 'bigIdeaTooltip', type: 'string', label: 'Big Idea Tooltip' },
              { name: 'targetCustomersTooltip', type: 'string', label: 'Target Customers Tooltip' }
            ]},
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

  // Custom sitemap implementation
  siteMap: ({ documents, models }) => {
    const pageModels = models.filter(m => m.type === 'page').map(m => m.name);
    return documents
      .filter(d => pageModels.includes(d.modelName))
      .map(document => {
        // For regular pages
        if (document.modelName === 'page') {
          const slugField = document.fields.slug?.type === 'string' ? document.fields.slug : undefined;
          const pageIdField = document.fields.pageId?.type === 'string' ? document.fields.pageId : undefined;

          if (!slugField || !pageIdField) return null;

          const slug = getLocalizedFieldForLocale(slugField);
          const pageId = getLocalizedFieldForLocale(pageIdField);

          if (!slug.value || !pageId.value) return null;

          const urlPath = slug.value === 'index' ? '/' : `/${slug.value.replace(/^\/+/, '')}`;

          return {
            stableId: pageId.value,
            urlPath,
            document,
            isHomePage: urlPath === '/'
          };
        }

        // For workshop steps
        if (document.modelName === 'workshopStep') {
          const stepNumberField = document.fields.stepNumber?.type === 'number' ? document.fields.stepNumber : undefined;
          const pageIdField = document.fields.pageId?.type === 'string' ? document.fields.pageId : undefined;

          if (!stepNumberField || !pageIdField) return null;

          const stepNumber = getLocalizedFieldForLocale(stepNumberField);
          const pageId = getLocalizedFieldForLocale(pageIdField);

          if (!stepNumber.value || !pageId.value) return null;

          const urlPath = `/step/${stepNumber.value}`;

          return {
            stableId: pageId.value,
            urlPath,
            document,
            isHomePage: false
          };
        }

        return null;
      })
      .filter(Boolean) as SiteMapEntry[];
  },

  // Create pageId when creating content
  async onContentCreate({ object, model }) {
    if (model.type !== 'page') {
      return object;
    }

    // For pages that already have a pageId field, use that value; if not, generate one
    const hasPageIdField = !!model.fields?.find(field => field.name === 'pageId');
    if (hasPageIdField && !object.pageId) {
      object.pageId = `${model.name}-${Date.now()}`;
    }

    return object;
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
