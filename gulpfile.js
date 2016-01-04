'use strict'

const gulp = require('gulp')
const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const del = require('del')
const nodemon = require('nodemon')
const minimist = require('minimist')

const R = require('ramda')

// ARGUMENTS
const args = minimist(process.argv.slice(2), {
  string: 'file',
  default: {file: 'main'}
})
// ARGUMENTS


// WEBPACK CONFIG
const externals = R.compose(
  R.reduce(function(modules, name) {
    modules[name] = `commonjs ${name}`
    return modules
  }, {}),
  R.filter(name => name !== '.bin')
)

const config = {
  entry: ['babel-polyfill', `./src/${args.file}.js`],
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: `${args.file}.js`
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.js$/, exclude: /node_modules/,
        query: {
          plugins: ['transform-runtime'],
          presets: ['stage-0', 'es2015']
        }
      }
    ]
  },
  plugins: [
    //new webpack.HotModuleReplacementPlugin()
  ],
  externals: externals(fs.readdirSync('node_modules')),
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['./src', 'node_modules']
  }
}
// WEBPACK CONFIG

gulp.task('clean-build', done => del('./build', done))

gulp.task('build', ['clean-build'], function(done) {
  webpack(config).run(function(err) {
    if (err) {
      console.log('Error', err)
    } else {
      console.log('Compilled')
      done()
    }
  })
})

gulp.task('build-watch', ['build'], function() {
  webpack(config).watch(100, function(err) {
    if (err) {
      console.log('Error', err)
    } else {
      console.log('Recompilled')
      nodemon.restart()
    }
  })
})

gulp.task('run', ['build-watch'], function() {
  nodemon({
    execMap: {js: 'node'},
    script: path.join(__dirname, `build/${args.file}`),
    ignore: ['*'],
    watch: ['foo/'],
    ext: 'noop'
  }).on('restart', console.log.bind(console, 'Restarted'))
})
