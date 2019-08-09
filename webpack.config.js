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
  
  };