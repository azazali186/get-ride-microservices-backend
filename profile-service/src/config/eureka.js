export default {
  instance: {
    instanceId: `${process.env.HOST || '192.168.30.28'}:profile-service:${process.env.PORT || 4120}`,
    app: 'PROFILE-SERVICE',
    hostName: process.env.HOST || '192.168.30.28',
    ipAddr: process.env.HOST || '192.168.30.28',
    statusPageUrl: `http://${process.env.HOST || '192.168.30.28'}:${process.env.PORT || 4120}/info`,
    healthCheckUrl: `http://${process.env.HOST || '192.168.30.28'}:${process.env.PORT || 4120}/health`,
    port: {
      '$': process.env.PORT || 4120,
      '@enabled': 'true',
    },
    vipAddress: 'profile-service',
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
