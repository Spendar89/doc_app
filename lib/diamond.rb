require 'tiny_tds'
class Diamond
  attr_accessor :client

  def initialize
    @client = TinyTds::Client.new username: 'sci\jsendar', password: 'Pass020215$', host: '10.10.17.7'
  end

  def test_execute
    results = []
    @client.execute("SELECT TOP 20 * FROM [825-Austin].dbo.lead").each {|r| results << r}
    results
  end
end
