// stackbit.config.js
module.exports = {
  stackbitVersion: '~0.6.0',
  nodeVersion: '18',
  ssgName: 'custom',
  devCommand: 'npx vite --port {PORT}',

  // Define content directories
  contentDirs: ['src/content'],

  // Define page models for URL mapping
  pageModels: ['page', 'workshopStep'],

  models: {
    // Page model for the main pages
    page: {
      type: 'page',
      label: 'Page',
      urlPath: '/{slug}',
      fields: [
        { name: 'title', type: 'string', label: 'Title', required: true },
        { name: 'slug', type: 'string', label: 'Slug', required: true },
        { name: 'content', type: 'markdown', label: 'Content' }
      ]
    },
    // Workshop step model
    workshopStep: {
      type: 'page',
      label: 'Workshop Step',
      urlPath: '/workshop/{stepNumber}',
      fields: [
        { name: 'title', type: 'string', label: 'Step Title', required: true },
        { name: 'stepNumber', type: 'number', label: 'Step Number', required: true },
        { name: 'description', type: 'markdown', label: 'Step Description' },
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
  assets: {
    referenceType: 'static',
    staticDir: 'public',
    uploadDir: 'images',
    publicPath: '/'
  }
};
