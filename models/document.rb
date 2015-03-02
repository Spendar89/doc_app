class Document
  attr_accessor :custom_fields, :template_id

  def initialize(custom_fields, template_id ="4fcfdb574166a271960025ff5dab3a3c941672a5") 
    @template_id = template_id
    @custom_fields = custom_fields
  end

end
