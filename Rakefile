APP_FILE = 'app.rb'
APP_CLASS = 'App'

require 'sinatra/assetpack/rake'

namespace :build do

  desc 'browserify js'
  task :js do
    `browserify -t reactify assets/js/app.js > public/js/bundle.js`
  end

  desc 'compile sass'
  task :css do
    `bundle exec compass compile`
  end

  desc 'browserify js and compile sass'
  task :all => [:js, :css] do
  end

  task :watchcss do
    `compass watch`
  end

  task :watchjs do
    `watchify -t reactify assets/js/app.js -o public/js/bundle.js`
  end

  desc 'build and stick around and watch for changes'
  task :watch do
    Rake::Task["build:watchjs"].execute
    Rake::Task["build:watchcss"].execute
  end
end
