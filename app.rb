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
  diamond = Diamond.new
  @document = Document.new(params[:custom_fields], params[:template_id])
  @email = params[:email]
  @name = params[:name]
  @leads_id = params[:leads_id]
  #title is set to template_id/leads_id combo for uniqueness
  @title = "doc_#{params[:template_title]}_#{@leads_id}_#{Time.now.to_i}"
  doc_maker = DocMaker.new(@document)
  doc_maker.request_signature(@email, @name, @title)
  @doc_id = doc_maker.get_signature_request_id
  if @doc_id
    diamond.add_document_to_lead(@leads_id, @doc_id, @title)
    { signature_request_id: @doc_id, 
      url: doc_maker.get_signing_url }.to_json
  else
    # handle Error...
  end
end

get '/leads/:leads_id/docs/:doc_id' do
  @doc_id = params[:doc_id]
  begin
    content_type :pdf
    return DocMaker.download_doc(@doc_id)
  rescue Exception => e
    content_type :json
    diamond = Diamond.new
    diamond.destroy_document(@doc_id)
    return "That Document Has Been Deleted"
  end
end

get '/leads/:leads_id/docs' do
  content_type :json
  diamond = Diamond.new
  leads_id = params[:leads_id]
  return diamond.get_lead_documents(leads_id).to_json
end

get '/terms' do
  content_type :json
  @diamond = Diamond.new
  program_description = params[:program_description]
  return @diamond.get_program_terms(program_description).to_json
end

get '/templates/:template_id' do
  content_type :json
  @document = Document.new({}, params[:template_id])
  doc_maker = DocMaker.new(@document)
  return doc_maker.get_template.to_json
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
  return @lead_data.map { |lead| @v.convert_lead(lead) }.to_json
end

get '/leads/:id' do
  content_type :json
  @d = Diamond.new
  @lead_data = @d.get_lead_detail params[:id]
  return @lead_data.to_json
end

put '/leads/:id' do
  content_type :json
  if params[:lead]
    @d = Diamond.new
    @lead_data = @d.update_lead params[:id], params[:lead]
    return @lead_data.to_json
  end
end
