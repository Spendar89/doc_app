require './lib/helpers'
require 'active_support/all'

class Document

  include ModelHelpers 

  attr_accessor :custom_fields, :template_id, :title, :subject, :template_ids, :options

  def initialize(custom_fields, template_id, template_ids=false, title="Default Title", subject="Default Subject") 
    @template_id = template_id
    @template_ids = template_ids
    @custom_fields = custom_fields
    @title = title
    @subject = subject
  end

  def options
    template_id_or_ids = @template_ids ? :template_ids : :template_id
    hashify.slice(:title, 
                  :subject, 
                  :custom_fields,
                  template_id_or_ids)
  end

end
