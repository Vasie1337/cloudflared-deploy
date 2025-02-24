function generate404Page(siteName) {
  return `<!DOCTYPE html>
    <!-- ... existing 404 page HTML ... -->
  `;
}

function generate500Page(siteName, nodeEnv, error) {
  return `<!DOCTYPE html>
    <!-- ... existing 500 page HTML ... -->
  `;
}

module.exports = {
  generate404Page,
  generate500Page
}; 