import { Environment } from 'vitest';

export default <Environment> {
  name: 'prisma',
  setup: async () => {
    console.log('testando environment');
    
    return {
      teardown() {}
    };
  },
  transformMode: 'ssr',
};
