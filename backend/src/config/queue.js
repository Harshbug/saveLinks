const {Queue}=require('bullmq');
const Redis=require('ioredis');

const QUEUE_NAME='metadata-fetch';

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379
})
const metadataQueue = new Queue(QUEUE_NAME, {
    connection: redis,
    defaultJobOptions:{
      attempts:3,
      backoff:{type:'exponential',delay:2000},
      removeOnComplete:true,
      removeOnFail:100,
    }
});

module.exports={metadataQueue,QUEUE_NAME};
