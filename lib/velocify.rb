require 'savon'

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

  def get_leads_by_phone(phone)
    begin
      res = request(:get_leads_by_phone, {phone: phone})
      res[:get_leads_by_phone_response][:get_leads_by_phone_result][:leads][:lead]
    rescue
      return nil
    end
  end

  def convert_lead(data)
      return unless data
      fields = data[:fields][:field]
      f = fields.map { |f| 
        #if f[:sdfgsdfg] 
          {f[:@field_title].gsub(/\s+/, "_").downcase.to_sym => f[:@value] } 
        #end
      }
      .reduce(Hash.new, :merge)
      .merge({ id: data[:@id], 
               create_data: data[:@create_date] })

      if (data[:agent])
       f.merge(data[:agent])
      else
        f
      end

  end

end
