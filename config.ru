require 'sinatra'
require 'rack/parser'
require 'dotenv'
require 'colorize'
Dotenv.load

use Rack::Parser, :content_types => {
  'application/json'  => Proc.new { |body| 
    ::MultiJson.decode body  
  }
}

configure do
  file = File.new("#{settings.root}/log/#{settings.environment}.log", 'a+')
  file.sync = true
  use Rack::CommonLogger, file
end

require './app'

run Sinatra::Application
