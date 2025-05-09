// stackbit.config.js
module.exports = {
  stackbitVersion: '~0.6.0',
  nodeVersion: '18',
  ssgName: 'custom',
  devCommand: 'npx vite --port {PORT}',

  // Define content directories
  contentDirs: ['src/content'],

  // Define model extensions for URL mapping
  modelExtensions: [
    { name: 'page', type: 'page', urlPath: '/{slug}' },
    { name: 'workshopStep', type: 'page', urlPath: '/step/{stepNumber}' }
  ],

  models: {
    // Page model for the main pages
    page: {
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
    workshopStep: {
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
  },

  // Custom sitemap implementation
  siteMap: function({ documents, models }) {
    const pageModels = models.filter(m => m.type === 'page').map(m => m.name);
    return documents
      .filter(d => pageModels.includes(d.modelName))
      .map(document => {
        // For pages
        if (document.modelName === 'page') {
          const slug = document.fields.slug?.value || '';
          const pageId = document.fields.pageId?.value || `page-${Date.now()}`;
          const urlPath = slug === 'index' ? '/' : `/${slug}`;

          return {
            stableId: pageId,
            urlPath: urlPath,
            document: document,
            isHomePage: urlPath === '/'
          };
        }

        // For workshop steps
        if (document.modelName === 'workshopStep') {
          const stepNumber = document.fields.stepNumber?.value || '';
          const pageId = document.fields.pageId?.value || `step-${stepNumber}-${Date.now()}`;
          const urlPath = `/step/${stepNumber}`;

          return {
            stableId: pageId,
            urlPath: urlPath,
            document: document,
            isHomePage: false
          };
        }

        return null;
      })
      .filter(Boolean);
  },

  // Create pageId when creating content
  onContentCreate: function({ object, model }) {
    if (model.type !== 'page') {
      return object;
    }

    // Add pageId if it doesn't exist
    if (!object.pageId) {
      object.pageId = `${model.name}-${Date.now()}`;
    }

    return object;
  },

  assets: {
    referenceType: 'static',
    staticDir: 'public',
    uploadDir: 'images',
    publicPath: '/'
  }
};
