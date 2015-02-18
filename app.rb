require './lib/doc_maker'
require 'sinatra/base'
require 'json'

class App < Sinatra::Base
  set :root, File.dirname(__FILE__)

  get '/' do
    File.read(File.join('public', 'index.html'))
    #my_account = HelloSign.get_account
    #return my_account.inspect
  end

  get 'hey' do
    "hey dude"
  end

  post '/docs' do
    content_type :json
    @doc_maker = DocMaker.new(params)
    @doc_maker.request_signature("jakesendar@gmail.com", "Jake Sendar")
  end
end
