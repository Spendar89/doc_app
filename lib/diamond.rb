require 'tiny_tds'
class Diamond
  attr_accessor :client

  def initialize
    #@client = TinyTds::Client.new username: 'sci\jsendar', password: 'Pass020215$', host: '10.10.17.7'
    @client = {}
  end

  def test_execute
    results = []
    @client.execute("SELECT TOP 20 * FROM [825-Austin].dbo.lead").each {|r| results << r}
    results
  end

  def get_lead_detail(leads_360_id)
    #results = []
    #@client.execute("SELECT * FROM [adm_manager].dbo.lead_detail where Leads360ID = '#{leads_360_id}'").each {|r| results << r}
    #results.first
    {"FName" => "Jake", "LName" => "Sendar"}
  end
end
