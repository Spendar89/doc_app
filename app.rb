require 'sinatra'
require 'uri'
require 'rubygems'
require './lib/doc_maker'
require './models/document'
require './lib/velocify'
require './lib/diamond'
require './lib/helpers'
require 'json'


set :root, File.dirname(__FILE__)

get '/' do
  File.read(File.join('public', 'index.html'))
end

post '/docs' do
  content_type :json

  custom_fields, campus, template_id, 
  recipients, leads_id, template_title = params[:custom_fields], 
                                         params[:campus],
                                         params[:template_id], 
                                         params[:recipients], 
                                         params[:leads_id], 
                                         params[:template_title]

  recipients = recipients.values.map do |r| 
    r.inject({}){|memo,(k,v)| memo[k.to_sym] = v; memo}
  end

  document = Document.new(custom_fields, template_id)
  doc_maker = DocMaker.new(document)
  title = "doc_#{template_title}_#{leads_id || 'no_lead'}_#{Time.now.to_i}"

  begin
    doc_maker.request_signature(recipients, title)
    doc_id = doc_maker.get_signature_request_id
    signatures = doc_maker.get_signatures

    if signatures

      if campus && leads_id
        diamond = Diamond.new(campus)
        unless diamond.errors.any?
          diamond.add_document_to_lead(leads_id, doc_id, title) 
        end
      end

      return  { signatures: signatures }.to_json

    else
      return  {  
        error: {  
          message: "Could not generate Doc..."  
        } 
      }.to_json
    end

  rescue Exception => e
    error = {}
    puts "heres the error: #{e}".red
    api_error = JSON.parse(e.message.split("Message:")[-1])["error"]

    if api_error
      error[:message] = api_error["error_msg"]
      error[:type] = api_error["error_name"]
    else
      error[:message] = "There was a problem generating your doc"
      error[:type] = "Unknown Error"
    end

    return error 404, error.to_json
  end
end

get '/templates/:template_id/signatures/:signature_id' do
  content_type :json

  @dm = DocMaker.new
  @dm.get_embedded_sign_url params[:signature_id]
  sign_url = @dm.embedded_sign_url.sign_url
  return sign_url.to_json
end

get '/leads/:leads_id/docs/:doc_id' do
  @doc_id = params[:doc_id]
  begin
    content_type :pdf
    return DocMaker.download_doc(@doc_id)
  rescue Exception => e
    content_type :json
    diamond = Diamond.new(params[:campus])
    diamond.destroy_document(@doc_id)
    return "That Document Has Been Deleted"
  end
end

delete '/leads/:leads_id/docs/:doc_id' do
  content_type :json

  id = params[:doc_id]
  diamond = Diamond.new params[:campus]

  diamond
    .destroy_document(id)
    .to_json
end

get '/leads/:leads_id/docs' do
  content_type :json
  diamond = Diamond.new(params[:campus])
  leads_id = params[:leads_id]
  return diamond.get_lead_documents(leads_id).to_json
end

get '/terms' do
  content_type :json
  d = Diamond.new(params[:campus])
  program_description = params[:program_description]
  return d.get_program_terms(program_description).to_json
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
  @d = Diamond.new(params[:campus])
  if @d.errors.any?
    return error 404, @d.errors[0].to_json
  else
    @lead_data = @d.get_lead_detail params[:id]
    return @lead_data.to_json
  end
end

put '/leads/:id' do
  content_type :json
  request.logger.info "Lead: #{params[:lead]}".yellow
  if params[:lead]
    @diamond = Diamond.new(params[:campus])
    lead = params[:lead]
    lead[:StatusCode] = "Pending FA"
    lead_data = @diamond.update_lead params[:id], lead
    request.logger.info "LEAD DATA: #{lead_data}".yellow
    return lead_data.to_json
  end
end
