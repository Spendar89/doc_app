class Document
  attr_accessor :custom_fields, :template_id

  def initialize(custom_fields, template_id = "3fb7cef48a0ec04e9ec9b1f02de90987ba801d79")
    @template_id = template_id
    @custom_fields = custom_fields
  end

end
