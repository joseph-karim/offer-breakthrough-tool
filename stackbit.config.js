// stackbit.config.js
module.exports = {
  stackbitVersion: '~0.6.0',
  nodeVersion: '18',
  ssgName: 'custom',
  devCommand: 'npx vite --port {PORT}',
  contentDirs: ['src'],
  models: {
    workshopStep: {
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
  },
  assets: {
    referenceType: 'static',
    staticDir: 'public',
    uploadDir: 'images',
    publicPath: '/'
  }
};
