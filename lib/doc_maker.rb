require './config/hello_sign'
require './lib/diamond'

class DocMaker
  attr_accessor :document, :sent_signature, :client

  # initialize with custom_fields hash and template_id
  def initialize(document)
    @client = HelloSign.client
    @document = document
  end

  # calls @client.send_signature_request_with_template method and sets 
  # @sent_signature to response object
  def request_signature(email, name, title = "Default Title", subject = "Default Subject")
    signer = { email_address: email, name: name, role: "Client" }
    @sent_signature ||= @client.send_signature_request_with_template(
      test_mode: 1, 
      title: title,
      subject: subject,
      signers: [signer],
      template_id: @document.template_id,
      custom_fields: @document.custom_fields
    )
  end

  def get_template
    template = @client.get_template(
      { template_id: @document.template_id }
    )
    cf_hash = {}
    template.custom_fields.each do |cf| 
      cf_hash[cf.name] = {name: cf.name, type: cf.type}
    end
    {customFields: cf_hash, id: template.template_id, title: template.title}
  end

  # convenience method for optaining signature_request_id from @sent_signature
  def get_signature_request_id
    @sent_signature ? @sent_signature.signature_request_id : false
  end

  def get_signing_url
    @sent_signature ? @sent_signature.signing_url : false
  end

  def self.download_doc(doc_id)
    client = HelloSign.client
    client.signature_request_files({signature_request_id: doc_id})
  end
end


