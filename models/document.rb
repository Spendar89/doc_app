class Document
  attr_accessor :custom_fields, :template_id, :title, :subject

  def initialize(custom_fields, template_id, title="Default Title", subject="Default Subject") 
    @template_id = template_id
    @custom_fields = custom_fields
    @title = title
    @subject = subject
  end

end
