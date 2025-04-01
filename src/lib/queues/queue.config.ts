import Queue from 'bull';

export const queueConfig = {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
  limiter: {
    max: 1000,
    duration: 5000,
  },
};

export const createQueue = <T>(name: string): Queue.Queue<T> => {
  const queue = new Queue<T>(name, process.env.REDIS_URL!, {
    ...queueConfig,
  });

  queue.on('error', (error) => {
    console.error(`Queue ${name} error:`, error);
  });

  queue.on('failed', (job, error) => {
    console.error(`Job ${job.id} in queue ${name} failed:`, error);
  });

  return queue;
};