require './config/hello_sign'
require './lib/diamond'
require './lib/app_cache'

class DocMaker
  attr_accessor :document, :sent_signature_request, :client, :embedded_sign_url

  # initialize with custom_fields hash and template_id
  def initialize(document = false)
    @client = HelloSign.client
    @document = document
  end

  # calls @client.send_signature_request_with_template method and sets 
  # @sent_signature_request to response object
  def create_embedded_signature_request(recipients) 
    @sent_signature_request ||= @client.create_embedded_signature_request_with_template(
      test_mode: 1, 
      client_id: ENV['HELLO_SIGN_CLIENT_ID'],
      signers: recipients,
      title: @document.title,
      subject: @document.subject,
      template_id: @document.template_id,
      custom_fields: @document.custom_fields
    )
  end

  def create_email_signature_request(recipients)
    @sent_signature_request ||= @client.send_signature_request_with_template(
      test_mode: 1, 
      signers: recipients,
      title: @document.title,
      subject: @document.subject,
      template_id: @document.template_id,
      custom_fields: @document.custom_fields
    )
  end

  def get_template(template=false)
    template ||= @client.get_template(
      { template_id: @document.template_id }
    )
    cf_hash = {}
    template.custom_fields.each do |cf| 
      cf_hash[cf.name] = {name: cf.name, type: cf.type}
    end
    roles = template.signer_roles.map(&:name)
    {customFields: cf_hash, id: template.template_id, title: template.title, roles: roles}
  end

  def get_templates
    ap = AppCache.new
    cached = ap.get_templates
    return cached if cached.any?
    templates = @client.get_templates.map{|t| get_template t}
    ap.set_templates templates 
    templates
  end

  # convenience method for optaining signature_request_id from @sent_signature_request
  def get_signature_request_id
    @sent_signature_request ? @sent_signature_request.signature_request_id : false
  end

  def get_embedded_sign_url(signature_id)
    @embedded_sign_url ||= @client.get_embedded_sign_url signature_id: signature_id
  end

  def get_signatures
    return false unless @sent_signature_request
    signatures = @sent_signature_request.signatures
    return signatures.map(&:data)
  end

  def get_signing_url
    @sent_signature_request ? @sent_signature_request.signing_url : false
  end

  def self.download_doc(signature_request_id)
    client = HelloSign.client
    client.signature_request_files({ signature_request_id: signature_request_id })
  end

  def self.get_signature_requests(email=false)
    client = HelloSign.client
    client.get_signature_requests
  end

  def self.get_signature_requests_by_email(email="jakesendar@gmail.com")
    get_signature_requests
      .select { |req|
        req.signatures.any? { |s| s.signer_email_address === email }
      }
      .map &:data 
  end

  def self.remind_signers(signature_request_id, email)
    client = HelloSign.client
    client.remind_signature_request signature_request_id: signature_request_id, email_address: email
  end
end
