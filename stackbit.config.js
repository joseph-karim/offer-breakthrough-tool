// stackbit.config.js
const { GitContentSource } = require('@stackbit/cms-git');

module.exports = {
  stackbitVersion: '~0.6.0',
  nodeVersion: '18',
  ssgName: 'custom',
  devCommand: 'npx vite --port {PORT}',

  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ['content'],
      assetsConfig: {
        referenceType: 'static',
        staticDir: 'public',
        uploadDir: 'images',
        publicPath: '/',
      },
      models: [
        // Workshop step model
        {
          name: 'WorkshopStep',
          type: 'page',
          label: 'Workshop Step',
          urlPath: '/step/{stepNumber}',
          fields: [
            { name: 'id', type: 'string', label: 'ID', required: true },
            { name: 'title', type: 'string', label: 'Step Title', required: true },
            { name: 'stepNumber', type: 'number', label: 'Step Number', required: true },
            { name: 'description', type: 'string', label: 'Step Description' },
            { name: 'pageId', type: 'string', label: 'Page ID', hidden: true },
            { name: 'infoBoxContent', type: 'string', label: 'Info Box Content' },
            {
              name: 'placeholders',
              type: 'object',
              label: 'Placeholders',
              fields: [
                { name: 'bigIdeaPlaceholder', type: 'string', label: 'Big Idea Placeholder' },
                { name: 'targetCustomersPlaceholder', type: 'string', label: 'Target Customers Placeholder' }
              ]
            },
            {
              name: 'tooltips',
              type: 'object',
              label: 'Tooltips',
              fields: [
                { name: 'bigIdeaTooltip', type: 'string', label: 'Big Idea Tooltip' },
                { name: 'targetCustomersTooltip', type: 'string', label: 'Target Customers Tooltip' },
                { name: 'businessGoalTooltip', type: 'string', label: 'Business Goal Tooltip' }
              ]
            },
            {
              name: 'labels',
              type: 'object',
              label: 'Labels',
              fields: [
                { name: 'bigIdeaLabel', type: 'string', label: 'Big Idea Label' }
              ]
            },
            {
              name: 'examples',
              type: 'object',
              label: 'Examples',
              fields: [
                {
                  name: 'items',
                  type: 'list',
                  label: 'Example Items',
                  items: { type: 'string' }
                }
              ]
            }
          ]
        }
      ],
    }),
  ],

  // Custom sitemap implementation
  siteMap: function({ documents, models }) {
    // If no documents are found, create a static sitemap
    if (!documents || documents.length === 0) {
      // Create a static sitemap with predefined steps
      return [
        { urlPath: '/intro', stableId: 'workshop-step-intro', label: 'Introduction', isHomePage: true },
        { urlPath: '/step/1', stableId: 'workshop-step-1', label: 'Step 1: Define Your Big Idea', isHomePage: false },
        { urlPath: '/step/2', stableId: 'workshop-step-2', label: 'Step 2: Clarify Your Underlying Goal', isHomePage: false },
        { urlPath: '/step/3', stableId: 'workshop-step-3', label: 'Step 3: Identify Trigger Events', isHomePage: false },
        { urlPath: '/step/4', stableId: 'workshop-step-4', label: 'Step 4: Define Customer Jobs', isHomePage: false },
        { urlPath: '/step/5', stableId: 'workshop-step-5', label: 'Step 5: Target Buyers', isHomePage: false },
        { urlPath: '/step/6', stableId: 'workshop-step-6', label: 'Step 6: Painstorming', isHomePage: false },
        { urlPath: '/step/7', stableId: 'workshop-step-7', label: 'Step 7: Choose Target Problems', isHomePage: false },
        { urlPath: '/step/8', stableId: 'workshop-step-8', label: 'Step 8: Define Your Focused Target Market', isHomePage: false },
        { urlPath: '/step/9', stableId: 'workshop-step-9', label: 'Step 9: Refine Your Idea', isHomePage: false },
        { urlPath: '/step/10', stableId: 'workshop-step-10', label: 'Step 10: Summary', isHomePage: false }
      ];
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
          const pageId = document.fields.pageId?.value;

          // Special case for intro page
          if (pageId === 'workshop-step-intro') {
            return {
              stableId: 'workshop-step-intro',
              urlPath: '/intro',
              document,
              label: title || 'Introduction',
              isHomePage: true
            };
          }

          if (!stepNumber) {
            return null;
          }

          return {
            stableId: `workshop-step-${stepNumber}`,
            urlPath: `/step/${stepNumber}`,
            document,
            label: title ? `Step ${stepNumber}: ${title}` : `Step ${stepNumber}`,
            isHomePage: false
          };
        }

        return null;
      })
      .filter(Boolean);
  },


};
