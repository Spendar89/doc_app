require 'uri'
require 'rubygems'
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
  @document = Document.new(params[:custom_fields], params[:template_id])
  @email = params[:email]
  @name = params[:name]
  #title is set to template_id/lead_id combo for uniqueness
  @title= "doc_#{params[:template_id]}_#{params[:lead_id]}"
  doc_maker = DocMaker.new(@document)
  doc_maker.request_signature(@email, @name, @title)
  { signature_request_id: doc_maker.get_signature_request_id, 
    url: doc_maker.get_signing_url }.to_json
end

get '/terms' do
  content_type :json
  @diamond = Diamond.new
  program_description = params[:program_description]
  @diamond.get_program_terms(program_description).to_json
end

get '/docs/:template_id/field_names' do
  content_type :json
  @document = Document.new({}, params[:template_id])
  doc_maker = DocMaker.new(@document)
  doc_maker.get_custom_field_names.to_json
end

get '/leads' do
  content_type :json
  @v = Velocify.new
  if params[:phone]
    @lead_data = @v.get_leads_by_phone(params[:phone])
  else
    @lead_data = @v.get_leads_by_email(params[:email])
  end
  return [].to_json unless @lead_data
  @lead_data.map { |lead| @v.convert_lead(lead) }.to_json
end

get '/leads/:id' do
  content_type :json
  @d = Diamond.new
  @lead_data = @d.get_lead_detail params[:id]
  @lead_data.to_json
end
