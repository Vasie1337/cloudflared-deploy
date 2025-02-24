// Helper function to format JSON nicely for display
const formatJSON = (obj) => {
  return JSON.stringify(obj, null, 2)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>')
    .replace(/ /g, '&nbsp;');
};

// Helper to get a color based on environment
const getEnvironmentColor = (env) => {
  switch(env.toLowerCase()) {
    case 'production':
      return '#dc3545';
    case 'staging':
      return '#fd7e14';
    case 'testing':
      return '#ffc107';
    case 'development':
    default:
      return '#28a745';
  }
};

module.exports = {
  formatJSON,
  getEnvironmentColor
}; 