require './config/hello_sign'

class DocMaker
  attr_accessor :custom_fields, :template_id, :sent_signature

  # initialize with custom_fields hash and template_id
  def initialize(custom_fields, template_id = "3fb7cef48a0ec04e9ec9b1f02de90987ba801d79")
    @client = HelloSign.client
    @custom_fields = custom_fields
    @template_id = template_id
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
      template_id: @template_id,
      custom_fields: @custom_fields
    )
  end

  # convenience method for optaining signature_request_id from @sent_signature
  def get_signature_request_id
    @sent_signature ? @sent_signature.signature_request_id : false
  end
end


