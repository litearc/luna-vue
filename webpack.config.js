module.exports = {

    module: {
      rules: [
        // sass loader
        {
          test: /\.sass$/,
          use: [
            'vue-style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                indentedSyntax: true
              }
            }
          ]
        },
        // pug loader
        {
          test: /\.pug$/,
          loader: 'pug-plain-loader'
        },
      ] // rules
    }, // module

    // This is supposed to make `template` work during runtime, but it doesn't.
    // Instead, setting `runtimeCompiler` in `vue.config.js` does it.
    // resolve: {
    //   alias: {
    //     vue: 'vue/dist/vue.js'
    //   }
    // },

};
