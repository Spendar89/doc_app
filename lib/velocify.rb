require 'savon'
require 'date'

class Velocify
  def initialize(username = ENV['VELOCIFY_USERNAME'], password = ENV['VELOCIFY_PASSWORD'])
    @username = username
    @password = password
    @client = Savon.client(wsdl: 'http://service.leads360.com/ClientService.asmx?WSDL')
  end

  def request(method, data)
    auth = { username: @username, password: @password}
    res = @client.call(method, {message: auth.merge(data)}) 
    res && res.body
  end

  def get_lead_by_id (lead_id)
    # TODO: Make error handling better...
    begin
      res = request(:get_lead, { lead_id: lead_id})
      res[:get_lead_response][:get_lead_result][:leads][:lead]
    rescue
      return nil
    end
  end

  def get_leads_by_email(email)
    begin
      res = request(:get_leads_by_email, {email: email})
      res[:get_leads_by_email_response][:get_leads_by_email_result][:leads][:lead]
    rescue
      return nil
    end
  end

  def get_leads_by_phone(phone)
    begin
      res = request(:get_leads_by_phone, {phone: phone})
      res[:get_leads_by_phone_response][:get_leads_by_phone_result][:leads][:lead]
    rescue
      return nil
    end
  end

  def update_lead_field(lead_id, field_key, new_value)
    return false unless new_value

    @lead ||= get_lead_by_id lead_id
    @field_ids ||= get_field_ids @lead

    field_id = @field_ids[field_key]

    request(:modify_lead_field, { 
      lead_id: lead_id, 
      field_id: field_id, 
      new_value: new_value
    })

  end

  def get_field_ids(data)
      return unless data

      fields = data[:fields][:field]

      f = fields.map { |f| 
        key = f[:@field_title].gsub(/\s+/, "_").downcase.to_sym 
        { key => f[:@field_id] } 
      }
      .reduce(Hash.new, :merge)
  end

  def convert_lead(data)
      return unless data
      puts "DATA #{data}".blue
      fields = data[:fields][:field]

      f = fields.map { |f| 
        key = f[:@field_title].gsub(/\s+/, "_").downcase.to_sym 
        { key => f[:@value] } 
      }
      .reduce(Hash.new, :merge)
      .merge({ id: data[:@id], 
               create_data: data[:@create_date] })

      data[:agent] ? f.merge(data[:agent]) : f
  end

end
