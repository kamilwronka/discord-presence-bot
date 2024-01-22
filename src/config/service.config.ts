import { registerAs } from '@nestjs/config';
import { RuntimeEnvironment } from 'src/types/common.types';

export interface ServiceConfig {
  env: RuntimeEnvironment;
}

export default registerAs('service', (): ServiceConfig => {
  const { ENV } = process.env;

  return {
    env: ENV,
  };
});
