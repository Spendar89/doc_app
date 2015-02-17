require './lib/doc_maker'
require 'sinatra/base'

class App < Sinatra::Base
  set :root, File.dirname(__FILE__)


  get '/' do
    File.read(File.join('public', 'index.html'))
    #my_account = HelloSign.get_account
    #return my_account.inspect
  end
end
