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
    request(:get_lead, { lead_id: lead_id})
  end

  def get_leads_by_phone(phone)
    res = request(:get_leads_by_phone, {phone: phone})
    res[:get_leads_by_phone_response][:get_leads_by_phone_result][:leads][:lead]
  end

end
