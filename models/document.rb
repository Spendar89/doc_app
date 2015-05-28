class Document
  attr_accessor :custom_fields, :template_id

  def initialize(custom_fields, template_id) 
    @template_id = template_id
    @custom_fields = custom_fields
  end

end
