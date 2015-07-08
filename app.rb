require 'sinatra'
require 'uri'
require 'rubygems'
require './lib/doc_maker'
require './models/document'
require './lib/velocify'
require './lib/diamond'
require './lib/helpers'
require './lib/app_cache'
require 'json'
require 'active_support/all'


set :root, File.dirname(__FILE__)

get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/programs' do
  content_type :json

  d = Diamond.new(params[:campus])
  d.get_programs_with_tuition.to_json
end

get '/terms' do
  content_type :json

  d = Diamond.new(params[:campus])
  program_no = params[:program_no]

  d.get_program_terms(program_no).to_json
end

post '/leads/:id/cache_state' do
  content_type :json

  app_cache = AppCache.new
  app_cache.set_by_lead params[:id], params[:state]
end

get '/leads/:id/cache' do
  content_type :json

  app_cache = AppCache.new
  state = app_cache.get_by_lead params[:id]
  state.to_json

end

post '/docs' do
  content_type :json

  custom_fields, campus, template_id, template_ids,
  recipients, leads_id, template_title, email = params[:custom_fields], 
                                                params[:campus],
                                                params[:template_id], 
                                                params[:template_ids],
                                                params[:recipients], 
                                                params[:leads_id], 
                                                params[:template_title],
                                                params[:email]

  recipients = recipients.values.map do |r| 
    r.inject({}){|memo,(k,v)| memo[k.to_sym] = v; memo}
  end

  document = Document.new custom_fields, template_id, template_ids, template_title, template_ids
  doc_maker = DocMaker.new document

  begin

    if email == 'true'
      doc_maker.create_email_signature_request recipients
    else
      doc_maker.create_embedded_signature_request recipients
    end

    doc = doc_maker.sent_signature_request.data

    if doc 
      return  { doc: doc }.to_json
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

    res = {error: error}.to_json

    return error 400, res 
  end
end

post '/signature_requests/:id/remind' do
  content_type :json

  email = params[:email]
  id = params[:id]

  res = DocMaker.remind_signers id, email
  res.to_json
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

get '/docs' do
  content_type :json
  email = params[:email]
  docs = DocMaker.get_signature_requests_by_email email 
  docs.to_json
end

get '/docs/:signature_request_id' do
  if params[:pdf]
    content_type :pdf
    signature_request_id = params[:signature_request_id]
    DocMaker.download_doc(signature_request_id)
  end
end


get '/templates/:template_id' do
  content_type :json

  @document = Document.new({}, params[:template_id])
  doc_maker = DocMaker.new(@document)

  doc_maker.get_template.to_json
end

get '/templates' do 
  content_type :json

  refresh = params[:refresh] === "true"

  dm = DocMaker.new
  dm.get_templates(refresh).to_json
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
  
  if @lead_data.is_a? Array
    leads = @lead_data.map { |lead| @v.convert_lead(lead) }
  else
    leads = [@v.convert_lead(@lead_data)]
  end

  leads.to_json
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
  lead = params[:lead]
  v_id = params[:v_id]
  if lead && v_id
    @v = Velocify.new
    email = lead[:email]
    f_name = lead[:FName]
    l_name = lead[:LName]
    @v.update_lead_field(v_id, :email_1, email) if email
    @v.update_lead_field(v_id, :first_name, f_name) if f_name
    @v.update_lead_field(v_id, :last_name, l_name) if l_name
  end

  if lead 
    @diamond = Diamond.new(params[:campus])
    lead[:StatusCode] = "Pending FA"
    lead_data = @diamond.update_lead params[:id], lead
    request.logger.info "LEAD DATA: #{lead_data}".yellow
    return lead_data.to_json
  end
end
