export default {
  instance: {
    instanceId: `${process.env.HOST || '192.168.30.28'}:ride-service:${process.env.PORT || 1460}`,
    app: 'RIDE-SERVICE',
    hostName: process.env.HOST || '192.168.30.28',
    ipAddr: process.env.HOST || '192.168.30.28',
    statusPageUrl: `http://${process.env.HOST || '192.168.30.28'}:${process.env.PORT || 1460}/info`,
    healthCheckUrl: `http://${process.env.HOST || '192.168.30.28'}:${process.env.PORT || 1460}/health`,
    port: {
      '$': process.env.PORT || 4160,
      '@enabled': 'true',
    },
    vipAddress: 'ride-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: process.env.EUREKA_HOST || 'localhost',
    port: process.env.EUREKA_PORT || 4145,
    servicePath: '/eureka/apps/'
  },
};
