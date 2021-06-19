import { Eureka, EurekaClient } from 'eureka-js-client';


export const registerAsEurekaService = (instance: EurekaClient.EurekaInstanceConfig) => new Eureka({
  eureka: {
    host: 'localhost',
    port: 8761,
    preferSameZone: false,
    // fetchRegistry: false,
    // registerWithEureka: true,
    servicePath: '/eureka/apps/',
    serviceUrls: {
      'us-east-1c': [
        'http://ec2-fake-552-627-568-165.compute-1.amazonaws.com:7001/eureka/v2/apps/', 'http://ec2-fake-368-101-182-134.compute-1.amazonaws.com:7001/eureka/v2/apps/',
      ],
    },
  },
  instance: {
    ...instance
  },
});