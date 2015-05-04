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

require './app'

run Sinatra::Application
