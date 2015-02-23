require 'sinatra'
require './lib/doc_maker'
require './models/document'
require './lib/velocify'
require './lib/diamond'
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

get '/leads' do
  content_type :json
  @v = Velocify.new
  @lead_data = @v.get_leads_by_phone params[:phone]
  return [] unless @lead_data
  @lead_data.map { |lead| @v.convert_lead(lead) }.to_json
end

get '/leads/:id' do
  content_type :json

  @v = Velocify.new
  @lead_data = @v.get_lead_by_id params[:id]
  @v.convert_lead(@lead_data).to_json
end
