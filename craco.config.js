const path = require('path')

module.exports = {
  babel: {
    plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
  },
  webpack: {
    alias: {
      '@/components': path.resolve(__dirname, 'src/components/'),
      '@/shared': path.resolve(__dirname, 'src/shared/'),
      '@/utils': path.resolve(__dirname, 'src/utils/'),
      '@/constants': path.resolve(__dirname, 'src/constants/'),
      '@/reducers': path.resolve(__dirname, 'src/reducers/'),
    },
  },
}
