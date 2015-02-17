APP_FILE = 'app.rb'
APP_CLASS = 'App'

require 'sinatra/assetpack/rake'

namespace :build do

  desc 'browserify js'
  task :js do
    `browserify assets/js/app.js > public/js/bundle.js`
  end

  desc 'compile sass'
  task :css do
    `bundle exec compass compile`
  end

  desc 'browserify js and compile sass'
  task :all => [:js, :css] do
  end

  desc 'build and stick around and watch for changes'
  task :watch do
    `watchify assets/js/app.js -o public/js/bundle.js`
    `bundle exec compass watch`
  end
end
