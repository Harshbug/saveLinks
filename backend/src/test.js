const { metadataQueue } = require('./config/queue')
metadataQueue.add('test-job', { hello: 'world' })
metadataQueue.add('test-job2',{bye:'world'})