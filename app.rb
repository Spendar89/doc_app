require 'sinatra'
require './lib/doc_maker'
require './models/document'
require 'json'

set :root, File.dirname(__FILE__)

get '/' do
  File.read(File.join('public', 'index.html'))
end

post '/docs' do
  content_type :json

  @document = Document.new(params)
  @email = "jakesendar@gmail.com"
  @name = "Jake Sendar"

  doc_maker = DocMaker.new(@document)
  doc_maker.request_signature(@email, @name)

  doc_maker.get_signature_request_id.to_json
end
