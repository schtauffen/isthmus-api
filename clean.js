const del = require('del')

del('lib').then(files => console.log('Deleting...\n', files.join('\n')))
