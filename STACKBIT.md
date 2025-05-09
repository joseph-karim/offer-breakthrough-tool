# Stackbit Integration Guide

This document provides information about the Stackbit integration with this project.

## Overview

This project is integrated with Stackbit for visual editing capabilities. The integration allows content editors to make changes to the workshop content directly through Stackbit's visual editor.

## Configuration

The Stackbit configuration is defined in `stackbit.config.ts` in the project root. This configuration:

1. Specifies the content sources (primarily in the `src` directory)
2. Defines content models for structured editing
3. Configures the development server command
4. Sets up annotations for identifying editable regions

## Editable Content

The following types of content can be edited through Stackbit:

- Workshop step titles and descriptions
- Form labels and placeholders
- Help tooltips and information boxes
- Example content

## Annotations

Content that can be edited visually is marked with `data-sb-field-path` attributes in the HTML. For example:

```jsx
<h2 data-sb-field-path="title">Define Your Big Idea</h2>
```

## Development

When developing with Stackbit:

1. Make sure the `stackbit-dev` script in package.json is correctly configured
2. Ensure the netlify.toml file has the proper Stackbit configuration
3. Add `data-sb-field-path` attributes to elements that should be editable

## Troubleshooting

If you encounter issues with the Stackbit integration:

1. Check that the dev server is running correctly with `npm run stackbit-dev`
2. Verify that the port configuration in stackbit.config.ts matches your Vite setup
3. Ensure that editable content has proper `data-sb-field-path` attributes
4. Check the browser console for any errors related to Stackbit

## Resources

- [Stackbit Documentation](https://docs.stackbit.com/)
- [Vite + Stackbit Integration Guide](https://docs.stackbit.com/integrations/vite)
