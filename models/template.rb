class Document
  attr_accesor :custom_fields, :template_id

  def initialize(template_id, custom_fields, email)
    @template_id = template_id
    @custom_fields = custom_fields
  end

end
