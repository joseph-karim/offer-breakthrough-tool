import { CSSProperties } from 'react';

// Common styles for all step components
export const stepContainerStyle: CSSProperties = {
  maxWidth: '800px',
  margin: '0 auto',
  backgroundColor: '#FFFFFF',
  color: '#333333',
  padding: '30px',
  borderRadius: '20px'
};

export const stepHeaderContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center', 
  marginBottom: '20px'
};

export const stepNumberStyle: CSSProperties = {
  backgroundColor: '#fcf720',
  color: 'black',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  marginRight: '15px',
  position: 'relative',
  top: '4px' // Adjust position to align with text baseline
};

export const stepTitleStyle: CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#333333',
  margin: 0,
  lineHeight: '1'
};

export const stepDescriptionStyle: CSSProperties = {
  marginBottom: '30px',
  color: '#555555'
};

export const contentContainerStyle: CSSProperties = {
  marginBottom: '40px'
};

export const labelStyle: CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#333333',
  display: 'block',
  marginBottom: '10px'
};

export const textareaStyle: CSSProperties = {
  width: '100%',
  minHeight: '100px',
  padding: '12px',
  borderRadius: '15px',
  border: '1px solid #DDDDDD',
  fontSize: '14px',
  lineHeight: '1.5',
  resize: 'vertical',
  backgroundColor: '#F2F2F2',
  color: '#333333',
};

export const errorTextareaStyle: CSSProperties = {
  ...textareaStyle,
  borderColor: '#ef4444'
};

export const errorMessageStyle: CSSProperties = {
  color: '#ef4444',
  fontSize: '14px',
  marginTop: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
};

export const saveIndicatorContainerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '4px'
};

export const examplesContainerStyle: CSSProperties = {
  backgroundColor: '#F0E6FF',
  borderRadius: '15px',
  padding: '20px'
};

export const examplesLabelStyle: CSSProperties = {
  display: 'inline-block',
  fontSize: '14px',
  color: '#FFFFFF',
  fontWeight: 'bold',
  marginBottom: '15px',
  backgroundColor: '#6B46C1',
  padding: '4px 12px',
  borderRadius: '20px'
};

export const examplesListStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  color: '#333333',
  fontSize: '14px'
};

export const exampleItemStyle: CSSProperties = {
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'flex-start'
};

export const exampleBulletStyle: CSSProperties = {
  color: '#6B46C1',
  marginRight: '10px',
  fontWeight: 'bold'
};

export const infoBoxStyle: CSSProperties = {
  padding: '12px 16px',
  backgroundColor: '#fff7ed',
  borderLeft: '4px solid #ea580c',
  borderRadius: '0 8px 8px 0',
  color: '#9a3412',
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '20px'
};

export const formGroupStyle: CSSProperties = {
  marginBottom: '30px'
};

export const inputStyle: CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: '15px',
  border: '1px solid #DDDDDD',
  fontSize: '14px',
  backgroundColor: '#F2F2F2',
  color: '#333333',
};

export const errorInputStyle: CSSProperties = {
  ...inputStyle,
  borderColor: '#ef4444'
};

// New styles for yellow highlight and focus elements
export const yellowHighlightStyle: CSSProperties = {
  backgroundColor: '#333333',
  color: '#fcf720',
  padding: '0 4px',
  fontWeight: 'bold'
};

export const yellowInfoBoxStyle: CSSProperties = {
  backgroundColor: '#fcf720',
  padding: '15px',
  borderRadius: '10px',
  marginBottom: '25px',
  color: '#222222',
  fontWeight: '500'
};