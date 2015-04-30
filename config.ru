require 'dotenv'
Dotenv.load

use Rack::Reloader, 0

require './app'

run Sinatra::Application
